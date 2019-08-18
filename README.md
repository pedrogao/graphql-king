# King(国王)

> graphql apollo-server 的最佳 API 实现

## 闲聊

**本来想使用 koa 作为 apollo 的服务器基础框架，但是 apollo 默认为 express，且大量的的文档资料以及生产项目均使用 express，所以换成 express，起初的版本用 koa 搭建的，其实改动真的很小，代码在 koa 分支上**

apollo 内置了统一的的异常处理和基础的异常类，且不能更改，因此不能再自定义新的基础异常类

总体的 Response 返回结果分为下面的两类(graphql 返回结果无法从 http 状态码进行判断，全部为 200):

- data(成功)

请求成功的结果:

```json
{
  "data": {
    "signIn": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiIxMzEyMzQyNjA0QHFxLmNvbSIsInVzZXJuYW1lIjoicGVkcm8iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE1NjYwMTUyMTYsImV4cCI6MTU2NjAxNzAxNn0.9SaQ8m28vaK5jmo8et7Ig9J-MNFomlyYjr3M8DeYRrg"
    }
  }
}
```

数据统一在 data 字段下

- error(异常，不可饶恕的错误)

```json
{
  "error": {
    "errors": [
      {
        "message": "Cannot query field \"usernames\" on type \"User\". Did you mean \"username\"?",
        "locations": [
          {
            "line": 7,
            "column": 5
          }
        ],
        "extensions": {
          "code": "GRAPHQL_VALIDATION_FAILED",
          "error_code": 10000
        }
      }
    ]
  }
}
```

一般出现在数据字段校验失败（目前只找到了这种）

- errors(失败)

生产环境下的结果：

```json
{
  "errors": [
    {
      "message": "Context creation failed: Your session expired. Sign in again.",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

开发环境下增加了异常的堆栈信息方便调试，apollo 默认不向日志或者终端记录异常信息

- data 和 errors

失败与成功并存，graphql 支持多请求的数据字段

```json
{
  "errors": [
    {
      "message": "未找到用户",
      "locations": [
        {
          "line": 6,
          "column": 3
        }
      ],
      "path": ["user"],
      "extensions": {
        "code": "NotFound",
        "error_code": 10000
      }
    }
  ],
  "data": {
    "users": [
      {
        "username": "pedro",
        "id": "1"
      }
    ],
    "user": null
  }
}
```

注意：**apollo 的返回结果顶部字段（top fields）只能有`errors`，`data`和`error`这三个，因此可根据这两个字段判断请求是否成功，当出现 errors 时，可根据下面的 extensions 和 message 来判断错误的类型以及信息**

## 使用

### 安装依赖

```bash
npm install
```

### 开发环境下运行

```bash
npm run dev
```

也可以选择普通的运行方式（非 nodemon）

```bash
npm run start
```

## TODOLIST

- [x] apollo2 已经是 best practice（最佳实践）了
- [x] 替换数据库为 sqlite3，方便测试
- [x] 支持 subscription
- [x] .graphql 文件范式
- [x] jwt 令牌支持
- [ ] 其它....
