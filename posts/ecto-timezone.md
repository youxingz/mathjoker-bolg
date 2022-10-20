---
title: "记一次 Ecto 的时区问题"
date: "2022-08-20"
---

### 起因

最初使用 `Ecto` + `Postgres` 来做持久层的时候，发现时区一直都是 `UTC+0` 时区，而我们的业务在国内（`UTC+8`），所以在存储/查询数据库内容的时候修改默认的时区，以更方便地将时间格式为字符串转给前端是有必要的。

我们初步排查了 `Postgres` 的时区设置，重置为当前所在时区，但问题依旧。于是开始排查是不是 `elixir` 本身对 `DateTime` `NaiveDateTime` 的设计没考虑时区问题，但很快我们通过几台不同的服务器进行测试，很容易便排除了 `elixir` 的问题，开始把目光聚焦在 `ecto` 这个库里。

### 发现

我们在初步翻看关于 `ecto` 的文档后并没有找到这个问题的解释，于是开始阅读 `ecto` 的源码，因为我们测试的数据都有 `:inserted_at` `:updated_at` 字段，而这两个字段是 `ecto` 在数据变更后自动赋值的，所以我们把目标定位到这两个字段的定义上，也就是 `schema` 下的 `timestamps/1` 这个函数。

在[官方文档](https://hexdocs.pm/ecto/Ecto.Schema.html#timestamps/1)上有对 `timestamps/1` 的具体解释，起初我们因为把目光一直聚集在时区问题上，一直想找到类似 `timezone` 这类的关键词，所以并未发现解决时区的办法，现在看来还是因为不熟悉 ecto 的设计思想而绕了弯路。

### 解决

我们直接翻开了 `schema.ex` 这个源文件，找到了这个处理时间相关的函数：
```elixir
defmacro timestamps(opts \\ []) do
    quote bind_quoted: binding() do
      timestamps = Keyword.merge(@timestamps_opts, opts)

      type = Keyword.get(timestamps, :type, :naive_datetime)
      autogen = timestamps[:autogenerate] || {Ecto.Schema, :__timestamps__, [type]}

      inserted_at = Keyword.get(timestamps, :inserted_at, :inserted_at)
      updated_at = Keyword.get(timestamps, :updated_at, :updated_at)

      if inserted_at do
        opts = if source = timestamps[:inserted_at_source], do: [source: source], else: []
        Ecto.Schema.field(inserted_at, type, opts)
      end

      if updated_at do
        opts = if source = timestamps[:updated_at_source], do: [source: source], else: []
        Ecto.Schema.field(updated_at, type, opts)
        Module.put_attribute(__MODULE__, :ecto_autoupdate, {[updated_at], autogen})
      end

      with [_ | _] = fields <- Enum.filter([inserted_at, updated_at], & &1) do
        Module.put_attribute(__MODULE__, :ecto_autogenerate, {fields, autogen})
      end

      :ok
    end
  end
```

很明显，`ecto` 针对 `inserted_at` 和 `updated_at` 两个字段进行了特别的处理，在 `autogen` 那行：
```elixir
autogen = timestamps[:autogenerate] || {Ecto.Schema, :__timestamps__, [type]}
```
我们发现此处使用了 `Ecto.Schema` 模块下的 `__timestamps__` 函数进行时间的自动生成，该函数定义如下：
```elixir
  def __timestamps__(:naive_datetime) do
    %{NaiveDateTime.utc_now() | microsecond: {0, 0}}
  end

  def __timestamps__(:naive_datetime_usec) do
    NaiveDateTime.utc_now()
  end

  def __timestamps__(:utc_datetime) do
    %{DateTime.utc_now() | microsecond: {0, 0}}
  end

  def __timestamps__(:utc_datetime_usec) do
    DateTime.utc_now()
  end

  def __timestamps__(type) do
    type.from_unix!(System.os_time(:microsecond), :microsecond)
  end
```

原来时间的生成是在这里处理的，并且使用了 `.utc_now()` 这个函数作为生成函数。所以！我们只需要把 `.utc_now()` 改成 `.local_now()` 就可以完美解决这个默认时区的问题了！

### 转折

于是很快提了一个 pull request 到 `ecto` 的仓库，但，仅 10 分钟，那个 24 小时在线的男人出现了，并无情地关闭了这个合并请求...

![img](/images/ecto-pr-local_now.png)

按 josevalim 所说 UTC+0 是有一定道理的，统一使用 UTC+0 这样反而会保证时区不会混乱，各个服务按自己要求再进行时间的转换就好了。

但，我们的服务跑这么久了，要重新去代码里更新数据库是不太现实的，这个问题之前未被发现也都是因为前端拿到时间字段后使用 `moment.js` 这样的库自动处理了。但现在因为有需求要迫使对时间做手动更改，所以不得不设置一个默认的时区。

### 终章

于是，根据 `schema.ex` 源码，我们使用宏统一修改了 `@timestamps_opts` 这个参数，以更换 `autogenerate` 的规则：
```elixir
defmodule App.Schema do
  defmacro __using__(_env) do
    quote do
      use Ecto.Schema
      @timestamps_opts [type: :naive_datetime, autogenerate: {NaiveDateTime, :local_now, []}]
      import Ecto.Changeset
      import Ecto.Query
    end
  end
end
```

这样凡是使用到 `App.Schema` 模块的地方都会使用当前时区来生成时间。

### 续
上述这种方法不好，大家不要学，推荐的做法是把 `Postgres` 的时区设置为 `UTC+0`，`ecto` 不做任何更改，给前端/客户端返回的时间需带时区信息，前端使用 API 上传数据的时候也都要带上时区信息或者使用时间戳。这样不仅仅支持多时区的服务，让大家可以统一时间问题，而且客户端在不同时区运行也都能正常显示当地时间。因为在国内时区都是采用北京时间，所以这个问题不容易暴露出来，但一旦涉及到时区的问题，就需要尽早将时区的转换下放到客户端而非服务端/数据库来处理。
