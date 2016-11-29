# sql复习

## tsql
```sql
--tsql实例
declare @myage int,@youage int,@myname varchar(50)
set @myage = 300
set @myname='chenyingqiao'+'asdf'
set @youage=200
if @myage<=@youage
    raiserror('my dayu you',2,1)
else
    raiserror('asdf',2,1)

select @myage as 'my age',@myname as 'myname'

SELECT  DATENAME( YEAR , getdate())  AS  'Year  Name'
SELECT  DATENAME( MONTH , getdate())  AS  'Month  Name'
SELECT  DATENAME( DAY , getdate())  AS  'Day  Name' 
go

```

## 游标
```sql

--定义一个游标
declare cMyCursor cursor static
for
select id,name from test
for read only

--打开游标
open cMyCursor
declare @name varchar(30),@id varchar(10)
fetch next from cMyCursor into @id,@name
while @@FETCH_STATUS=0
begin
    print 'id:'+@id+'name:'+@name+CHAR(13)+CHAR(10)
    fetch next from cMyCursor into @id,@name
end

-- 跳转到指定位置
fetch last from cMyCursor into @id,@name
print 'id:'+@id+'name:'+@name+CHAR(13)+CHAR(10)
fetch relative 3 from cMyCursor into @id,@name
print 'id:'+@id+'name:'+@name+CHAR(13)+CHAR(10)
--关闭触发器
close cMyCursor
--删除触发器引用
deallocate cMyCursor

```

## 函数
```sql
--定义一个函数参数为@name 返回值未varchar（30）
-- 函数中不能有select语句
create function myfun (@name varchar(10))
returns varchar(30)
as
begin
    return 'hah:'+@name
end

declare @name varchar(30)
exec @name= myfun @name='asdf'
print @name
```

## 存储过程
```sql
--创建存储过程一个输出参数
create procedure mypro @name varchar(10) output
as
select @name=name from test where id=1


--调用存储过程
declare @id_name_one varchar(10)
exec mypro @id_name_one output
print @id_name_one
```

##约束
```sql
数据库约束是为了保证数据的完整性(正确性)而实现的一套机制
非空约束
主键约束(PK) primary key constraint 唯一且不为空
唯一约束 (UQ)unique constraint 唯一，允许为空，但只能出现一次
默认约束 (DF)default constraint 默认值
检查约束 (CK)check constraint 范围以及格式限制
外键约束 (FK)foreign key constraint 表关系


--添加主键约束
alter table Score
add constraint  PK_Score primary key(sId)

 
--添加唯一约束
alter table student
add constraint UQ_student unique(sNo)


--添加默认约束
alter table student
add constraint DF_student default('男') for sSex

--添加检查约束
alter table student
add constraint CK_student check(sAge >=18 and sAge <=100)

alter table student
add constraint CK_Sutdent1 check(sSex='男' or sSex='女')

alter table student
add constraint CK_Student2 check(sIntime>sBirthday)          --入学日期必须大于出生日期

--添加外键约束（主键表Class 外键表student）
alter table student
add constraint FK_student
foreign key(sClassId) references Class(cId) --外键student表中的sClassId来references引用主键表中的cid
on delete cascade      --级联删除,添加约束的时候加上这个，删除主表的时候，会把外键对应的子表级联删除(慎用)
on update cascade      --级联更新
--删除约束
alter table student
drop constraint FK_student

 

 

--约束练习
--Teacher表中
--tSex  控制只能是男 女，默认男 
--tAge  在30-40之间  默认30
--tName 唯一
alter table Teacher
add constraint CK_Teacher_tSex check(tSex='男' or tSex='女'),
constraint DF_Teacher_tSex default ('男') for tSex,
constraint CK_Teacher_tAge check(tAge>=30 and tAge <=40),
constraint DF_Teacher_tAge default (30) for tAge,
constraint UQ_Teacher_tName unique (tName)

 

 

--在建表的时候创建约束

--drop table Student0
create table Student0
(
 sId int identity(1,1) primary key,
 sName nvarchar(10) not null,
 sAge int constraint CK_Student0_sAge check(sAge >= 18) constraint DF_Student0_sAge default(18),
 sClassId int constraint FK_Student0_sClassId foreign key (sClassId) references Class(cId)
)
```

# 一些例子

1.
CREATE 产品表 INDEX C_ProdID ON 产品表(产品编号);

2.
create view Custmer_view
as
select 客户编号，客户名称，地区 from 销售商列表；

3.
CREATE PROCEDURE AvgPrice
as
select avg(money) from 产品表；

exec AvgPrice;


4.
CREATE PROCEDURE ExistProdID 
(
@proid char(10) input
@result int output
)
as
select @result=count(*) from 产品表；
if @result==0
    raiserror('没有相关产品',2,1)

5.
create function fn_SearchProd
(@pru_id char(8))
returns int
as 
begin 
declare @a int
set @a=(select 库存量 from 产品表 where 产品编号=@pru_id)
return @a
end 

6.
create trigger up_ProdSale on 产品销售表 
for update 
as
if UPDATE(数量)
 begin 
    Raiserror('不能修改')
    RollBack Transaction
 end 
 go