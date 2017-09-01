package com.taikor.investment.utils;

import android.content.Context;
import android.widget.Toast;

import java.io.Serializable;

/**
 * 吐司辅助类
 * Created by Any on 2017/4/13.
 */

public class ToastUtils {

    private static Toast toast;

    //短时间显示Toast
    public static void showShort(Context context, Serializable message) {
        if (null == toast) {
            toast = Toast.makeText(context, "", Toast.LENGTH_SHORT);
        }
        if (message instanceof String) {
            toast.setText((String) message);
        } else if (message instanceof Integer) {
            toast.setText((Integer) message);
        }
        toast.show();
    }
}
