package com.taikor.investment.base;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import butterknife.ButterKnife;
import butterknife.Unbinder;

/**
 * Activity基类
 * Created by Any on 2017/7/27.
 */

public abstract class BaseActivity extends AppCompatActivity {

    private Unbinder bind=null;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutResource());
        bind=ButterKnife.bind(this);//绑定View
        initView();
        initData();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        bind.unbind();//绑定View
    }

    //获取布局资源ID
    public abstract int getLayoutResource();

    //初始化布局
    protected abstract void initView();

    //初始化数据
    public void initData() {
    }

}
