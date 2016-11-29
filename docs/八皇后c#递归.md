# 八皇后递归 C\#

> 八皇后解法


```java

using System;
using System.Collections.Generic;
using System.Text;
namespace 算法
{
    class 八皇后
    {
        //int[,] qipan;
        int n;
        int CountAll;
        public int CountAll1
        {
            get { return CountAll; }
        }
        //用一个list来记录整个路线，如果有到达相应的目的的数目那吗就将总数加一
       // List<List<int[]>> All_m = new List<List<int[]>>();
        public 八皇后(int num)
        {
            //qipan=new int[i,i]
            n = num;
            for (int i = 0; i < n; i++)
            {
                List<int[]> l=new List<int[]>();
                l.Add(new int[]{i,0});
                LookUP_(l);
            }
        }
        //判断是否符合八皇后所需的位置
        //分裂-----相互拷贝
        public void LookUP_(List<int[]> l)
        {
            int allError = 0;
            int x_start = -1;
            if (l.Count >= n)
            {
                ++CountAll;
                return;
            }
            for (int i = 0; i < n; i++)//这一条线路下层的所有的元素
            {
                if (this.Check_(l, ++x_start, l[l.Count - 1][1] + 1))//检查是否符合规则
                {
                    //this.All_m.Add(this.CopyOut(l, l[l.Count - 1][0] + i, l[l.Count - 1][1] + 1));
                    LookUP_(this.CopyOut(l, x_start, l[l.Count - 1][1] + 1));
                }
                else
                {
                    if (allError >= n)
                    {
                        return;
                    }
                    ++allError;
                }
            }
            //All_m.Remove(l);
        }
        public bool Check_(List<int[]> allpoint,int x,int y)
        {
            for (int i = 0; i < allpoint.Count; i++)
            {
                int xy_long=Math.Abs(allpoint[i][1]-y);
                if ((x == allpoint[i][0] + xy_long) || (x == allpoint[i][0] - xy_long) || (x == allpoint[i][0]))
                {
                    return false;
                }
            }
            return true;
        }
        public List<int[]> CopyOut(List<int[]> l,int x,int y)
        {
            List<int[]> Copylist = new List<int[]>();
            foreach (int[] list in l)
            {
                Copylist.Add(list);
            }
            Copylist.Add(new int[] { x, y });
            return Copylist;
        }
    }
}

```