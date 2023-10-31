---
title: "Noridc nRF52 PWM"
date: "2023-10-31"
---

`Nordic` 的 `nRF52` 系列芯片除了基本的蓝牙能力非常出色之外，也配备了很多性能不错的外设，比如这次探讨的 `PWM` 模块。后文的所有代码及示例如无特别说明都是基于 `nRF52840` 来测试运行，一般来说在诸如 `nRF52832` `nRF52833` 这些芯片上也能完整运行。

`PWM` 模块共有 4 组，分别是 `PWM0` `PWM1` `PWM2` `PWM3`，如果使用的是 SoftDevice 模式开发，需要在 `sdkconfig.h` 文件中开启对应的 `enable` 宏，如果是在 `Zephyr OS` 下开发，也只需要在 `proj.conf` 文件中配置如 `CONFIG_NRFX_PWM0=y` 即可。

![Topology of nRF52 PWM module](/images/nrf52-pwm.png)

其中每一组都分别有 4 个通道 (channel) 可以独立配置 PWM 的输出，也就是说这块芯片可以最大支持 4x4=16 路的 PWM 输出，每一路都可以独立配置占空比 (Duty)，每一个模块都可以配置不同的 PWM 频率及运行优先级。为了更好地理解 Noridc 这套东西是如何运作的，我们先引入一个基本概念：`Wave Counter` (波形计数器)：

`nRF52` 的波形计数器有两种类型：`Up Mode` `Up & Down Mode`，如下图所示：

![Up Mode](/images/nrf52-wavecounter-up.png)
*Up Mode*

这里的 `OUT[x]` 表示配置的 GPIO 口输出的高低电平信号，`CMPx` 表示计数器的比较值，`COUNTERTOP` 表示计数器目标值（可以比作 PWM 的周期参数）。可以看到，在 `Up Mode` 模式中输出的信号与在 `Up & Down Mode` 中输出的结果占空情况有所不同，大多数情况下我们只需要使用 `Up Mode` 即可，很少部分可能会用到第二种模式。

![Up And Down Mode](/images/nrf52-wavecounter-up-down.png)
*Up And Down Mode*

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
