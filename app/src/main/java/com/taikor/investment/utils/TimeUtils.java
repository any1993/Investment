package com.taikor.investment.utils;

import android.util.Log;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * 时间格式转化工具类
 */
public class TimeUtils {

    private static final SimpleDateFormat DEFAULT_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private static final int DAY = 60 * 60 * 1000 * 24;
    private static final int HOUR = 60 * 60 * 1000;
    private static final int MIN = 60 * 1000;
    private static final int SEC = 1000;

    //判断当前是星期几
    public static String getWeek(String strDate) {//2017-08-16
        int year = Integer.parseInt(strDate.substring(0, 4));
        int month = Integer.parseInt(strDate.substring(5, 7));
        int day = Integer.parseInt(strDate.substring(8, 10));

        Calendar c = Calendar.getInstance();

        c.set(Calendar.YEAR, year);
        c.set(Calendar.MONTH, month - 1);
        c.set(Calendar.DAY_OF_MONTH, day);

        String week = "";
        int weekIndex = c.get(Calendar.DAY_OF_WEEK);

        switch (weekIndex) {
            case 1:
                week = "星期天";
                break;
            case 2:
                week = "星期一";
                break;
            case 3:
                week = "星期二";
                break;
            case 4:
                week = "星期三";
                break;
            case 5:
                week = "星期四";
                break;
            case 6:
                week = "星期五";
                break;
            case 7:
                week = "星期六";
                break;
        }
        return week;
    }

    //转换时间
    public static String longToString(long time) {
        try {
            long duration =System.currentTimeMillis()-time;
            //计算天数
            long day = duration / DAY;
            // 计算小时数
            long hour = duration / HOUR;
            // 计算分钟数
            long min = duration % HOUR / MIN;
            // 计算秒数
            long second = duration % MIN / SEC;

            if (day == 0) {
                if (hour > 0) {
                    return hour + "小时前";
                } else {
                    return min + "分钟前";
                }
            } else {
                if (day > 7) {
                    return "一周前";
                } else {
                    return day + "天前";
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    //时间转换
    public static String getData(String data) {

        try {
            Date serverDate = DEFAULT_FORMAT.parse(data);
            long duration = System.currentTimeMillis() - serverDate.getTime();
            //计算天数
            long day = duration / DAY;
            // 计算小时数
            long hour = duration / HOUR;
            // 计算分钟数
            long min = duration % HOUR / MIN;
            // 计算秒数
            long second = duration % MIN / SEC;

            if (day == 0) {
                if (hour > 0) {
                    return hour + "小时前";
                } else {
                    return min + "分钟前";
                }
            } else {
                if (day > 7) {
                    return "一周前";
                } else {
                    return day + "天前";
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

}
