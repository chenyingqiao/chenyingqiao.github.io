# centeos安装pip3

```
CentOS 安装easy_install、pip的方法            
CentOS 安装easy_install的方法：
wget -q http://peak.telecommunity.com/dist/ez_setup.py
python ez_setup.py
8、CentOS安装python包管理安装工具pip的方法如下：
wget --no-check-certificate https://github.com/pypa/pip/archive/1.5.5.tar.gz
注意：wget获取https的时候要加上：--no-check-certificate

tar zvxf 1.5.5    #解压文件
cd pip-1.5.5/
python3 setup.py install
OK，这样就安装好pip了，

下面来安装 requests吧。

pip3 install requests
```
