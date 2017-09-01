package com.taikor.investment.utils;

import android.content.Context;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.youth.banner.loader.ImageLoader;

/**
 * 加载图片
 * Created by Any on 2017/4/28.
 */

public class GlideUtils extends ImageLoader {
    
    @Override
    public void displayImage(Context context, Object path, ImageView imageView) {
        //Glide 加载图片简单用法
        Glide.with(context)
                .load(path)
                .fitCenter()
                .into(imageView);
    }
    
}
