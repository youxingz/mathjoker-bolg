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

![Up And Down Mode](/images/nrf52-wavecounter-up-down.png)
*Up And Down Mode*

