# mysql使用技巧2


## 同时插入多个数据
```
insert into video_user (username,password) values ('ying','1231234'),('ying','asdf1234');
```

## 如何进行转列
`我们可以通过case来进行列的筛选`

比如现在我有表video_user
```
mysql> select * from video_user;
+-----+----------+--------------+
| uid | username | password     |
+-----+----------+--------------+
|   1 | ying     | 1234         |
|   2 | asdf     | 1234         |
|   3 | asdf     | 123412341234 |
|   4 | asdf     | 123412341234 |
|   5 | asdf     | 123412341234 |
|   6 | asdf     | 123412341234 |
|   7 | asdf     | 123412341234 |
|   8 | asdf     | 123412341234 |
+-----+----------+--------------+

```

>现在我要进行查询  需要统计ying和asdf这两种用户的数量

我可以这样写
```sql
select count(case when username='ying' then username end) as 'ying',count(case when username='asdf' then username end) as 'asdf' from video_user;
```

利用case 我们可以进行多个统计函数的查询 

如果以前我会这样写
```sql
select * from (select count(uid) as ying from video_user where username='ying') as ying cross join (select count(uid) as asdf from video_user where username='asdf') as asd;
```

## 列转行