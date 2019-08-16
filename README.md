# King(国王)

> graphql apollo-koa-server 的最佳 API 实现

**本来想使用 koa 作为 apollo 的服务器基础框架，但是 apollo 默认为 express，且大量的的文档资料以及生产项目均使用 express，所以换成 express，起初的版本用 koa 搭建的，其实改动真的很小，代码在 koa 分支上**

## TODOLIST

- [x] 默认 koa 集成 graphql
- [x] 替换数据库为 sqlite3，方便测试
- [x] 支持 subscription
- [x] .graphql 文件范式
- [x] jwt 令牌支持
- [ ] 异常统一处理，摒弃 Apollo Error
