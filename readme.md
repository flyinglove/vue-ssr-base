1. server端每个用户一个实例
2. 数据预取， 在server端完成解析， 不需要设置响应式
2. beforeCreate和created上避免副作用代码
3. 访问特定平台api：
    1. 兼容各个平台
    2. 惰性访问仅浏览器可用api
4. 自定义指令：
    多数自定义指令直接操作dom
        1. 推荐使用组件作为抽象机制，避免使用自定义指令
        2. 创建renderer时使用directives设置指令的server端版本