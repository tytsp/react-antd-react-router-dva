![](/readme/img/login.png)
![](/readme/img/home.png)
![](/readme/img/userStting.png)
![](/readme/img/recordQuery.png)


使用方法：
进入package.json同级目录

1.执行命令：npm install 或 yarn 下载依赖的包
2.执行命令：npm run dev 进入开发环境
默认端口为8080

127.0.0.1:8080


构建：
npm run build
将会生成dist目录

部署：

服务 nginx
运行环境 window(zip)或者 linux(tar)
配置文件修改

conf下nginx.conf
server下修改listen为9090
加入location / {
     try_files $uri @fallback;
 }
(根据自己的情况调节cpu线程以及扩展集群配置)
静态资源目录位置在html文件夹下

2.4启动服务

$ nginx –s start


