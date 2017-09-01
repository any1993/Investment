package com.taikor.investment.utils;

import android.content.Context;
import android.support.design.widget.TabLayout;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.taikor.investment.AppApplication;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.text.DecimalFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 常用工具类
 * Created by Any on 2017/8/4.
 */

public class CommonUtils {

    //dp转成px
    public static int dip2px(float dipValue) {
        final float scale = AppApplication.getAppContext().getResources().getDisplayMetrics().density;
        return (int) (dipValue * scale + 0.5f);
    }

    //显示软键盘
    public static void showKeyBoard(Context context, EditText mEditText) {
        InputMethodManager imm = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.showSoftInput(mEditText, InputMethodManager.RESULT_SHOWN);
        imm.toggleSoftInput(InputMethodManager.SHOW_FORCED, InputMethodManager.HIDE_IMPLICIT_ONLY);
    }

    //隐藏软键盘
    public static void hideSoftKeyboard(View view) {

        Context context = AppApplication.getAppContext();

        InputMethodManager inputMethodManager = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
        if (inputMethodManager.isActive()) {
            inputMethodManager.hideSoftInputFromWindow(view.getApplicationWindowToken(), 0);
        }
    }

    //获得屏幕高度
    public static int getScreenWidth() {
        return AppApplication.getAppContext().getResources().getDisplayMetrics().widthPixels;
    }

    //获得屏幕宽度
    public static int getScreenHeight() {
        return AppApplication.getAppContext().getResources().getDisplayMetrics().heightPixels;
    }

    //设置TabLayout模式
    public static void dynamicSetTabLayoutMode(TabLayout tabLayout) {
        int tabWidth = calculateTabWidth(tabLayout);
        int screenWidth = getScreenWidth();

        if (tabWidth <= screenWidth) {
            tabLayout.setTabMode(TabLayout.MODE_FIXED);
        } else {
            tabLayout.setTabMode(TabLayout.MODE_SCROLLABLE);
        }
    }

    private static int calculateTabWidth(TabLayout tabLayout) {
        int tabWidth = 0;
        for (int i = 0; i < tabLayout.getChildCount(); i++) {
            final View view = tabLayout.getChildAt(i);
            view.measure(0, 0); // 通知父view测量，以便于能够保证获取到宽高
            tabWidth += view.getMeasuredWidth();
        }
        return tabWidth;
    }

    /**
     * 保留两位小数
     *
     * @param number double
     * @return String类型的两位小数
     */
    public static String setDoubleTwo(double number) {
        DecimalFormat df = new DecimalFormat("0.00");
        return df.format(number);
    }

    /**
     * 保留两位小数
     *
     * @param number double
     * @return Float类型的两位小数
     */
    public static Float getDoubleTwo(double number) {
        DecimalFormat df = new DecimalFormat("0.00");
        return Float.valueOf(df.format(number));
    }

    /**
     * 保留四位小数
     *
     * @param number double
     * @return String类型的四位小数
     */
    public static String setDoubleFour(double number) {
        DecimalFormat df = new DecimalFormat("0.0000");
        return df.format(number);
    }

    // 格式化html字符串
    public static String getNewContent(String html_text) {

        Document doc = Jsoup.parse(html_text);
        Elements elements = doc.getElementsByTag("img");
        for (Element element : elements) {
            element.attr("width", "100%").attr("height", "auto");
        }

        return doc.toString();
    }

}
