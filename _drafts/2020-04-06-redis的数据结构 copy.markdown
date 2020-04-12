---
layout:     post
title:      "redis的数据结构"
subtitle:   "redis的数据结构"
date:       2020-04-06
author:     "Lerko"
header-img: "/img/post-bg-e2e-ux.jpg"
catalog: true
multilingual: false
tags:
    - leetcode
---

# 对称的二叉树

## 解题思路

> 通过递归遍历输出带左右节点特征的字符串，然后比对字符串是否相等即可


## 代码

```java
func isSymmetric(root *TreeNode) bool {
    if(root == nil) {
        return true
    }
    treeLeftStr := ""
    Traversal(root.Left,"m",&treeLeftStr,true);
    // fmt.Println(treeLeftStr)

    treeRightStr := ""
    Traversal(root.Right,"m",&treeRightStr,false);
    // fmt.Println(treeRightStr)

    return treeLeftStr == treeRightStr;
}

/**
    前序遍历获取字符串
 */
func Traversal(root *TreeNode,opsition string,upNode *string,isNormalTra bool){
    //tree遍历结束
    if(root == nil){
        return
    }
    if isNormalTra {
        *upNode += fmt.Sprintf("%d%s",root.Val,opsition)
        Traversal(root.Left,"l",upNode,isNormalTra)
        Traversal(root.Right,"r",upNode,isNormalTra)
    }else{
        *upNode += fmt.Sprintf("%d%s",root.Val,opsition)
        Traversal(root.Right,"l",upNode,isNormalTra)
        Traversal(root.Left,"r",upNode,isNormalTra)
    }
}
```

