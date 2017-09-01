package com.taikor.investment.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * 保存数据
 * Created by Any on 2017/4/13.
 */

public class SharedPreferenceUtils {

    private static String SP_NAME = "config";
    private static SharedPreferences sp;

    //保存Boolean类型的值
    public static void saveBoolean(Context context, String key, boolean value) {
        if (sp == null) {
            sp = context.getSharedPreferences(SP_NAME, 0);
        }
        sp.edit().putBoolean(key, value).apply();
    }

    //获取boolean的值
    public static boolean getBoolean(Context context, String key, boolean defValue) {
        if (sp == null) {
            sp = context.getSharedPreferences(SP_NAME, 0);
        }
        return sp.getBoolean(key, defValue);
    }

    //保存String类型的值
    public static void saveString(Context context, String key, String value) {
        if (sp == null) {
            sp = context.getSharedPreferences(SP_NAME, 0);
        }
        sp.edit().putString(key, value).apply();
    }

    //获取String类型的值
    public static String getString(Context context, String key, String defValue) {
        if (sp == null) {
            sp = context.getSharedPreferences(SP_NAME, 0);
        }
        return sp.getString(key, defValue);
    }
}

