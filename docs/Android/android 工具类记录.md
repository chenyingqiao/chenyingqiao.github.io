# Android 工具类

> 有一些是之前本地文件支持的
> 可能现在无法使用

```java
package tool;

import java.io.DataOutputStream;
import java.io.File;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Random;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.annotation.SuppressLint;
import android.app.ActivityManager;
import android.app.Notification;
import android.app.PendingIntent;
import android.app.PendingIntent.CanceledException;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.drawable.Drawable;
import android.location.LocationManager;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.provider.MediaStore;
import android.provider.Settings;
import android.telephony.TelephonyManager;
import android.text.Html;
import android.text.Html.ImageGetter;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.LinearLayout;
import android.widget.LinearLayout.LayoutParams;
import android.widget.PopupWindow;
import android.widget.RemoteViews;

import com.baidu.location.LocationClientOption;
import com.baidu.location.LocationClientOption.LocationMode;
import com.example.yiyipro.R;
import com.gitonway.niftydialogeffects.widget.niftydialogeffects.Effectstype;
import com.gitonway.niftydialogeffects.widget.niftydialogeffects.NiftyDialogBuilder;
import com.lidroid.xutils.http.RequestParams;

/**
 * 工具函数库
 * 
 * @author cyq
 * 
 */
public class function {

    /**
     * 获取当前网络是否连接
     * 
     * @param context
     * @return
     */
    public static boolean isNetworkConnected(Context context) {
        if (context != null) {
            ConnectivityManager mConnectivityManager = (ConnectivityManager) context
                    .getSystemService(Context.CONNECTIVITY_SERVICE);
            NetworkInfo mNetworkInfo = mConnectivityManager
                    .getActiveNetworkInfo();
            if (mNetworkInfo != null) {
                return mNetworkInfo.isAvailable();
            }
        }
        return false;
    }

    /**
     * 判断应用是否第一次登陆
     * 
     * @param context
     * @return
     */
    public static Boolean isFirstLoad(Context context) {
        SharedPreferences share = context.getSharedPreferences("Onload",
                Context.MODE_PRIVATE);
        Editor editor = share.edit();// 获取编辑的对象
        String shareString = share.getString("isFirst", "");
        if (shareString.equals("yes")) {
            // 不是第一次进入应用
            return false;
        } else {
            // 是第一次进入应用
            editor.putString("isFirst", "yes");
            editor.commit();// 提交数据存储
            return true;
        }
    }

    /**
     * 只保留可见字符--去除所有非数值和字母的
     * 
     * @param data
     * @return
     */
    public static String SuperTrim(String data) {
        data = data.trim();
        char strarr[] = data.toCharArray();
        String result = "";
        for (char i : strarr) {
            if ((i <= 57 && i >= 48) || (i >= 65 && i <= 90)
                    || (i >= 97 && i <= 122)) {
                result += i;
            }
        }
        return result;
    }

    /**
     * 获取手机mac地址<br/>
     * 错误返回12个0
     */
    public static String getMacAddress(Context context) {
        // 获取mac地址：
        String macAddress = "000000000000";
        try {
            WifiManager wifiMgr = (WifiManager) context
                    .getSystemService(Context.WIFI_SERVICE);
            WifiInfo info = (null == wifiMgr ? null : wifiMgr
                    .getConnectionInfo());
            if (null != info) {
                if (!TextUtils.isEmpty(info.getMacAddress()))
                    macAddress = info.getMacAddress().replace(":", "");
                else
                    return macAddress;
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            return macAddress;
        }
        return macAddress;
    }

    /**
     * 获取手机号码 需要权限<uses-permission
     * android:name="android.permission.READ_PHONE_STATE" />
     * 
     * @param context
     * @return (index 1)电话号码和(index 2)imei号码
     */
    public static List<String> GetPhoneNumber(Context context) {
        TelephonyManager tm = (TelephonyManager) context
                .getSystemService(Context.TELEPHONY_SERVICE);
        List<String> list = new ArrayList<String>();
        // 手机号码
        list.add(tm.getLine1Number());
        // 获取一个设备唯一的ID号码
        list.add(tm.getDeviceId());
        return list;
    }

    /**
     * 用来判断服务是否运行.
     * 
     * @param context
     * @param className
     *            判断的服务名字
     * @return true 在运行 false 不在运行
     */
    public static boolean isServiceRunning(Context mContext, String className) {
        boolean isRunning = false;
        ActivityManager activityManager = (ActivityManager) mContext
                .getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningServiceInfo> serviceList = activityManager
                .getRunningServices(30);
        if (!(serviceList.size() > 0)) {
            return false;
        }
        for (int i = 0; i < serviceList.size(); i++) {
            if (serviceList.get(i).service.getClassName().equals(className) == true) {
                isRunning = true;
                break;
            }
        }
        return isRunning;
    }

    /**
     * 获取整一个随机的字符串
     */
    public static String getRandomString(int length) { // length表示生成字符串的长度
        String base = "abcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < length; i++) {
            int number = random.nextInt(base.length());
            sb.append(base.charAt(number));
        }
        return sb.toString();
    }

    /**
     * 返回文件的扩展名
     * 
     * @param file
     * @return
     */
    public static String getExtension(File file) {
        if (!file.isDirectory()) {
            String path = file.getAbsolutePath();
            String[] arr = path.split(".");
            return arr[arr.length - 1];
        }
        return null;
    }

    /**
     * 图文并茂的text
     * 
     * @param htmlStrings
     *            将图片的<img src='image1'>和文字分开最后在进行合并成一个完成的charsequence
     * @param image
     *            图片列表
     * @return
     */
    static int num = 0;

    /**
     * 将里面的图像标签替换成相应的图像文件 使用的要是<img src=1> 1表示的是imageid
     * 
     * @param htmlStrings
     * @param imageList
     * @return
     */
    public static List<CharSequence> getHtmlCharstring(String htmlStrings,
            List<Drawable> imageList) {
        List<CharSequence> resultCharSequence = new ArrayList<CharSequence>();
        CharSequence charSequencehtml = htmlStrings;
        Pattern pattern = Pattern.compile("<img\\ssrc=(\\d+)/>");
        Matcher matcher = pattern.matcher(charSequencehtml);
        int number = 0;
        int last = 0;
        while (matcher.find()) {
            // 当前匹配的字符串
            String findImageNodeString = matcher.group(0);
            int faceid = Integer.parseInt(matcher.group(1));
            // 将字符串替换成图像
            CharSequence charSequence = getHtmlCharstring(findImageNodeString,
                    imageList.get(faceid));
            // 当前匹配的位置的开始如果是0的话就截断图像开始位置之前的字符串
            if (matcher.start() != 0) {
                CharSequence swpe = getHtmlCharstring(charSequencehtml
                        .subSequence(last, matcher.start()));
                resultCharSequence.add(swpe);
            } else {
                resultCharSequence.add(getHtmlCharstring(charSequencehtml
                        .subSequence(last, matcher.start())));
            }
            resultCharSequence.add(charSequence);
            last = matcher.end();
            number++;
        }
        resultCharSequence.add(getHtmlCharstring(charSequencehtml.subSequence(
                last, charSequencehtml.length())));
        return resultCharSequence;
    }

    /**
     * 单张图片和HTML文字 String iamgeString= "<img src='image1'/><img
     * src='image2'/>这里是图片1 <font size='3' color='red'>This is some
     * text!</font><font size='2' color='blue'>This is some text!</font> <font
     * face='verdana' color='green'>This is some text!</font>" ;
     * 
     * @param htmlString
     * @param imageDrawable
     * @return
     */
    public static CharSequence getHtmlCharstring(String htmlString,
            final Drawable imageDrawable) {
        CharSequence charSequence = Html.fromHtml(htmlString,
                new ImageGetter() {
                    @Override
                    public Drawable getDrawable(String source) {
                        // TODO 自动生成的方法存根
                        imageDrawable.setBounds(0, 0,
                                imageDrawable.getIntrinsicWidth(),
                                imageDrawable.getIntrinsicHeight());
                        return imageDrawable;
                    }
                }, null);
        return charSequence;
    }

    /**
     * 单独html文字
     * 
     * @param htmlstring
     * @return
     */
    public static CharSequence getHtmlCharstring(String htmlstring) {
        CharSequence charSequence = Html.fromHtml(htmlstring);
        return charSequence;
    }

    /**
     * 单独html文字
     * 
     * @param htmlstring
     * @return
     */
    public static CharSequence getHtmlCharstring(CharSequence htmlstring) {
        CharSequence charSequence = Html.fromHtml(htmlstring.toString());
        return charSequence;
    }

    /**
     * 通过hashmap来进行赋
     * 
     * @param hashMap
     * @return 返回包含数据的requesparams
     */
    public static RequestParams mapForeachForRequestParams(
            HashMap<String, String> hashMap) {
        RequestParams requestParams = new RequestParams();
        Iterator<String> iterable = hashMap.keySet().iterator();
        while (iterable.hasNext()) {
            String keyString = iterable.next();
            requestParams.addBodyParameter(keyString, hashMap.get(keyString));
        }
        return requestParams;
    }

    /**
     * 获取view
     * 
     * @param context
     * @param viewGroup
     * @param id
     * @return
     */
    public static View GetIniflat(Context context, ViewGroup viewGroup, int id) {
        LayoutInflater inflater = (LayoutInflater) context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        return inflater.inflate(id, viewGroup);
    }

    /**
     * 将uri转换成路径
     * 
     * @param contentUri
     * @param context
     * @return
     */
    public static String getRealPathFromURI(Uri contentUri, Context context) {
        String res = null;
        String[] proj = { MediaStore.Images.Media.DATA };
        Cursor cursor = context.getContentResolver().query(contentUri, proj,
                null, null, null);
        if (cursor.moveToFirst()) {
            ;
            int column_index = cursor
                    .getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
            res = cursor.getString(column_index);
        }
        cursor.close();
        return res;
    }

    /**
     * md5加密
     * 
     * @param s
     * @return
     */
    public final static String MD5(String s) {
        char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f' };
        try {
            byte[] btInput = s.getBytes();
            // 获得MD5摘要算法的 MessageDigest 对象
            MessageDigest mdInst = MessageDigest.getInstance("MD5");
            // 使用指定的字节更新摘要
            mdInst.update(btInput);
            // 获得密文
            byte[] md = mdInst.digest();
            // 把密文转换成十六进制的字符串形式
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static String getAppName(int pID, Context context) {
        String processName = null;
        ActivityManager am = (ActivityManager) context
                .getSystemService(Context.ACTIVITY_SERVICE);
        List l = am.getRunningAppProcesses();
        Iterator i = l.iterator();
        PackageManager pm = context.getPackageManager();
        while (i.hasNext()) {
            ActivityManager.RunningAppProcessInfo info = (ActivityManager.RunningAppProcessInfo) (i
                    .next());
            try {
                if (info.pid == pID) {
                    CharSequence c = pm.getApplicationLabel(pm
                            .getApplicationInfo(info.processName,
                                    PackageManager.GET_META_DATA));
                    // Log.d("Process", "Id: "+ info.pid +" ProcessName: "+
                    // info.processName +"  Label: "+c.toString());
                    // processName = c.toString();
                    processName = info.processName;
                    return processName;
                }
            } catch (Exception e) {
                // Log.d("Process", "Error>> :"+ e.toString());
            }
        }
        return processName;
    }

    /**
     * 返回location的设置项
     * 
     * @return
     */
    public static LocationClientOption GetDBoption() {
        LocationClientOption locationClientOption = new LocationClientOption();
        locationClientOption.setLocationMode(LocationMode.Hight_Accuracy);
        locationClientOption.setScanSpan(3000);
        locationClientOption.setCoorType("bdll09");
        locationClientOption.setIsNeedAddress(true);
        locationClientOption.setNeedDeviceDirect(true);
        return locationClientOption;
    }

    @SuppressLint("NewApi")
    public static PopupWindow FullScreenWaitpop(Context context) {
        LayoutInflater layoutInflater = LayoutInflater.from(context);
        View view = layoutInflater.inflate(R.layout.waitpopwindow, null);
        LinearLayout linearLayout = (LinearLayout) view
                .findViewById(R.id.linearlayout_popwindow);
        PopupWindow popupWindow = new PopupWindow(view,
                LayoutParams.FILL_PARENT, LayoutParams.FILL_PARENT, true);
        return popupWindow;
    }

    /**
     * 如果字符串是“”或者是null的话就放回false
     * 
     * @param padding
     * @return
     */
    public static boolean isnullorpace(String padding) {
        try {
            if (padding.equals("") || padding == null) {
                return false;
            } else {
                return true;
            }
        } catch (Exception ee) {
            return false;
        }
    }

    // 获取一个自定义的dialog
    public static NiftyDialogBuilder DialogBU(Context context,
            Effectstype effect, String messge) {
        NiftyDialogBuilder dialogBuilder = NiftyDialogBuilder
                .getInstance(context);
        dialogBuilder
                .withTitle("提示")
                // .withTitle(null) no title
                .withTitleColor("#FFFFFF")
                // def
                .withDividerColor("#11000000")
                // def
                .withMessage(messge)
                // .withMessage(null) no Msg
                .withMessageColor("#111111")
                // def
                .withIcon(context.getResources().getDrawable(R.drawable.ic_lun))
                .isCancelableOnTouchOutside(true) // def | isCancelable(true)
                .withDuration(700) // def
                .withEffect(effect) // def Effectstype.Slidetop
                .withButton1Text("OK") // def gone
                .withButton2Text("Cancel") // def gone
                                            // or
                                            // ResId,context)
        ;
        return dialogBuilder;
    }

    /**
     * 创建一个notification
     * 
     * @param context
     * @param titile
     * @param layoutId
     * @param intent
     *            点击打开的intent
     * @return
     */
    public static Notification createNotification(Context context,
            String titile, int layoutId, Intent intent) {
        @SuppressWarnings("deprecation")
        Notification notification = new Notification(R.drawable.ic_lun, titile,
                System.currentTimeMillis());
        RemoteViews remoteViews = new RemoteViews(context.getPackageName(),
                layoutId);
        notification.contentView = remoteViews;
        PendingIntent contentIntent = PendingIntent.getActivity(context,
                R.string.app_name, intent, PendingIntent.FLAG_UPDATE_CURRENT);
        notification.contentIntent = contentIntent;
        return notification;
    }
    /**
     * 隐藏输入法
     * 
     * @param v
     *            输入框
     */
    public static void HideKeyboard(View v) {
        InputMethodManager imm = (InputMethodManager) v.getContext()
                .getSystemService(Context.INPUT_METHOD_SERVICE);
        if (imm.isActive()) {
            imm.hideSoftInputFromWindow(v.getApplicationWindowToken(), 0);
        }
    }

    /**
     * 显示虚拟键盘
     * 
     * @param v
     *            输入框
     */
    public static void ShowKeyboard(View v) {
        InputMethodManager imm = (InputMethodManager) v.getContext()
                .getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.showSoftInput(v, InputMethodManager.SHOW_FORCED);
    }

    /**
     * 判断GPS是否开启，GPS或者AGPS开启一个就认为是开启的
     * 
     * @param context
     * @return true 表示开启
     */
    public static final boolean GpsisOPen(final Context context) {
        LocationManager locationManager = (LocationManager) context
                .getSystemService(Context.LOCATION_SERVICE);
        // 通过GPS卫星定位，定位级别可以精确到街（通过24颗卫星定位，在室外和空旷的地方定位准确、速度快）
        boolean gps = locationManager
                .isProviderEnabled(LocationManager.GPS_PROVIDER);
        // 通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位）
        // boolean network =
        // locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
        // if(gps || network) {
        // return true;
        // }
        // return false;
        return gps;
    }

    /**
     * 强制帮用户打开GPS
     * 
     * @param context
     */
    public static final void openGPS(Context context) {
        Intent GPSIntent = new Intent();
        GPSIntent.setClassName("com.android.settings",
                "com.android.settings.widget.SettingsAppWidgetProvider");
        GPSIntent.addCategory("android.intent.category.ALTERNATIVE");
        GPSIntent.setData(Uri.parse("custom:3"));
        try {
            PendingIntent.getBroadcast(context, 0, GPSIntent, 0).send();
        } catch (CanceledException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 应用程序运行命令获取 Root权限，设备必须已破解(获得ROOT权限)
     * 
     * @return 应用程序是/否获取Root权限
     */
    public static boolean upgradeRootPermission(String pkgCodePath) {
        Process process = null;
        DataOutputStream os = null;
        try {
            String cmd = "chmod 777 " + pkgCodePath;
            process = Runtime.getRuntime().exec("su"); // 切换到root帐号
            os = new DataOutputStream(process.getOutputStream());
            os.writeBytes(cmd + "\n");
            os.writeBytes("exit\n");
            os.flush();
            process.waitFor();
        } catch (Exception e) {
            return false;
        } finally {
            try {
                if (os != null) {
                    os.close();
                }
                process.destroy();
            } catch (Exception e) {
            }
        }
        return true;
    }

    /**
     * 到gps设置界面
     * 
     * @param context
     */
    public static void ToGpsConfig(Context context) {
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            context.startActivity(intent);
        } catch (ActivityNotFoundException ex) {
            // The Android SDK doc says that the location settings activity
            // may not be found. In that case show the general settings.

            // General settings activity
            intent.setAction(Settings.ACTION_SETTINGS);
            try {
                context.startActivity(intent);
            } catch (Exception e) {
            }
        }
    }

}

```