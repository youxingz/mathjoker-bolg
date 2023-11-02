---
title: "Noridc nRF52 PWM"
date: "2023-10-31"
---

Nordic 的 `nRF52` 系列芯片除了基本的蓝牙能力非常出色之外，也配备了很多性能不错的外设，比如这次探讨的 `PWM` 模块。PWM 是日常生活中无处不在的存在，比如对灯的亮度调节、电机的转速，任何需要做「限流」的场景都有着 PWM 的身影。
后文的所有代码及示例如无特别说明都是基于 `nRF52840` 来测试运行，一般来说在诸如 `nRF52832` `nRF52833` 这些芯片上也能完整运行。

### PWM 模块介绍

PWM 模块共有 4 组，分别是 `PWM0` `PWM1` `PWM2` `PWM3`，如果使用的是 SoftDevice 模式开发，需要在 `sdkconfig.h` 文件中开启对应的 enable 宏，如果是在 Zephyr OS 下开发，也只需要在 `proj.conf` 文件中配置如 `CONFIG_NRFX_PWM0=y` 即可。

![Topology of nRF52 PWM module](/images/nrf52-pwm.png)

其中每一组都分别有 4 个通道 (channel) 可以独立配置 PWM 的输出，也就是说这块芯片可以最大支持 4x4=16 路的 PWM 输出，每一路都可以独立配置占空比 (Duty)，每一个模块都可以配置不同的 PWM 频率及运行优先级。为了更好地理解 Noridc 这套东西是如何运作的，我们先引入一个基本概念：`Wave Counter` (波形计数器)：

`nRF52` 的波形计数器有两种类型：`Up Mode` `Up & Down Mode`，如下图所示：

![Up Mode](/images/nrf52-wavecounter-up.png)
*Up Mode*

这里的 `OUT[x]` 表示配置的 GPIO 口输出的高低电平信号，`CMPx` 表示计数器的比较值，`COUNTERTOP` 表示计数器目标值（可以比作 PWM 的周期参数）。可以看到，在 `Up Mode` 模式中输出的信号与在 `Up & Down Mode` 中输出的结果占空情况有所不同，大多数情况下我们只需要使用 `Up Mode` 即可，很少部分可能会用到第二种模式。

![Up And Down Mode](/images/nrf52-wavecounter-up-down.png)
*Up And Down Mode*

### 示例

我们来看一段简单的示例代码：

```c
/**
 * #include <nrfx_pwm.h>
 * #define PIN_OUT1 xx // GPIO
 */
/* instance */
static nrfx_pwm_t m_pwm0 = NRFX_PWM_INSTANCE(0);

/* init */
uint32_t period_us = 1000;
nrfx_pwm_config_t config = {
    .output_pins =
    {
        PIN_OUT1,                  // channel 0
        NRF_PWM_PIN_NOT_CONNECTED, // channel 1
        NRF_PWM_PIN_NOT_CONNECTED, // channel 2
        NRF_PWM_PIN_NOT_CONNECTED, // channel 3
    },
    .irq_priority = 2,
    .base_clock   = NRF_PWM_CLK_1MHz,
    .count_mode   = NRF_PWM_MODE_UP,     // Up Mode
    .top_value    = period_us,           // COUNTERTOP
    .load_mode    = NRF_PWM_LOAD_COMMON, // 波形模式：4 个 channel 完全一致
    .step_mode    = NRF_PWM_STEP_AUTO
};
nrfx_err_t err_code = nrfx_pwm_init(&m_pwm0, &config, NULL, NULL);

/* config pwm duty */
/* 注意！这里必须加 static，因为 nRF PWM 会在 RAM 中加载 duty 配置，所以该内存不能在函数执行后释放 */
static nrf_pwm_values_common_t dutys[1];
/* 考虑使用 Up Mode，所以在比较曲线上升的时候 OUT[0] 会在 200 时刻变换信号，换算为占空比（低电平为空）便是 80% */
/* duty = (1000 - 200) / 1000 = 80% */
/* 如果要输出相反的高低电平信号，设置符号位为 1 即可，即：dutys[0] = 200 | 0x8000; */
dutys[0] = 200;

nrf_pwm_values_t values = {
  .p_common = dutys,
};
nrf_pwm_sequence_t sequence = {
  .values = values,
  .length = NRF_PWM_VALUES_LENGTH(dutys),
  .repeats = 0,
  .end_delay = 0,
};
uint16_t repeat_count = 666; /* repeat this signal 666 times */
/* start pwm */
uint32_t task_address = nrfx_pwm_simple_playback(&m_pwm0, &sequence, repeat_count, NRFX_PWM_FLAG_STOP);
```

PWM 的 `load mode` 有 4 种，上述使用的是第一种 (`common` 模式)，一般来说上述代码便已经满足了大多数场景下 PWM 的使用，比如电机驱动、占空波形发生等。但为了充分使用 `nRF52` 的 PWM 模块，我们再细说一下其余三种模式： `grouped` `individual` `wave form`.

### Load Mode

![Load Mode](/images/nrf52-pwm-load-mode.png)

这 4 种不同的加载模式其实都是使用一个 COMPARE 来完成的，并同步从 RAM 中加在下一个 COMPARE 值对应的占空比数据，然后输出给不同的通道。我们以一个简单的序列举例：

![Alt text](/images/nrf52-pwm-compare.png)

从图中可知道每次 COMPAREx 触发后都相当于一次新的 PWM 周期，然后会读取 RAM 里存储的 `dutys` 值后进行占空比设置。

#### Grouped Mode

在 `Grouped Mode` 下，只需要修改占空比的参数即可：

```c
// 配置 config 处需要修改：
    .output_pins =
    {
        PIN_OUT1,                  // channel 0
        NRF_PWM_PIN_NOT_CONNECTED, // channel 1
        PIN_OUT2,                  // channel 2
        NRF_PWM_PIN_NOT_CONNECTED, // channel 3
    },
// ...

static nrf_pwm_values_grouped_t dutys[1];
dutys[0].group_0 = 200; // channel 0, 1
dutys[0].group_1 = 800; // channel 2, 3

nrf_pwm_values_t values = {
  .p_grouped = dutys,
};

// ...
```

这段代码运行结果会是一个互补的方波交替前进，如下图所示：

![Grouped Mode](/images/nrf52-pwm-grouped.png)

#### Individual Mode

这个模式可以完整控制任何一路的 PWM 占空比输出，示例代码如下：

```c
// 配置 config 处需要修改：
    .output_pins =
    {
        PIN_OUT1,                  // channel 0
        PIN_OUT2,                  // channel 1
        PIN_OUT3,                  // channel 2
        PIN_OUT4,                  // channel 3
    },
// ...

static nrf_pwm_values_individual_t dutys[1];
dutys[0].channel_0 = 200; // channel 0
dutys[0].channel_1 = 800; // channel 1
dutys[0].channel_2 = 200; // channel 2
dutys[0].channel_3 = 800; // channel 3

nrf_pwm_values_t values = {
  .p_individual = dutys,
};

// ...
```

#### Wave Form Mode

波形模式的示例代码同上述类似，我们可以看一下它的结构体：

```c
typedef struct {
    uint16_t channel_0;   ///< Duty cycle value for channel 0.
    uint16_t channel_1;   ///< Duty cycle value for channel 1.
    uint16_t channel_2;   ///< Duty cycle value for channel 2.
    uint16_t counter_top; ///< Top value for the pulse generator counter.
} nrf_pwm_values_wave_form_t;
```

与 `nrf_pwm_values_individual_t` `nrf_pwm_values_grouped_t` `nrf_pwm_values_common_t` 不同的是，`nrf_pwm_values_wave_form_t` 除了不同 `channel` 的设定值外，还可以设置 `counter_top` 参数，用户就可以实时改变周期来进行更多功能的开发。

### 尾

Nordic nRF52 系列是一个经典系列，帮助诞生了很多尺寸非常小巧同时功能又很强大的应用产品。它的 PWM 模块支持最多 16 路高精度的独立控制，用来做近距离（蓝牙范围内）的飞控或桌面级的无线控制微型机器人都是非常不错的选择。

*如果对此文有任何疑问或新的理解可以联系作者邮箱建立沟通* 🙂

