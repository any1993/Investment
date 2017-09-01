package com.taikor.investment;

import android.support.v4.app.FragmentTransaction;
import android.view.KeyEvent;
import android.view.View;

import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.find.FindFragment;
import com.taikor.investment.news.NewsFragment;
import com.taikor.investment.optional.OptionalFragment;
import com.taikor.investment.utils.ToastUtils;

import butterknife.OnClick;

public class MainActivity extends BaseActivity {

    private long exitTime = 0;
    private FindFragment findFragment;
    private NewsFragment newsFragment;
    private OptionalFragment optionalFragment;

    @Override
    public int getLayoutResource() {
        return R.layout.activity_main;
    }

    @Override
    protected void initView() {
        showFragment(0);
    }

    @Override
    public void initData() {
        super.initData();
    }

    @OnClick({R.id.rb_find, R.id.rb_news, R.id.rb_optional})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.rb_find:
                showFragment(0);
                break;
            case R.id.rb_news:
                showFragment(1);
                break;
            case R.id.rb_optional:
                showFragment(2);
                break;
            default:
        }
    }

    //显示指定的fragment
    private void showFragment(int i) {
        FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();
        hideFragment(transaction);
        switch (i) {
            case 0:
                if (findFragment == null) {
                    findFragment = new FindFragment();
                    transaction.add(R.id.fl_content, findFragment);
                } else {
                    transaction.show(findFragment);
                }
                break;
            case 1:
                if (newsFragment == null) {
                    newsFragment = new NewsFragment();
                    transaction.add(R.id.fl_content, newsFragment);
                } else {
                    transaction.show(newsFragment);
                }
                break;
            case 2:
                if (optionalFragment == null) {
                    optionalFragment = new OptionalFragment();
                    transaction.add(R.id.fl_content, optionalFragment);
                } else {
                    transaction.show(optionalFragment);
                }
                break;
            default:
        }
        transaction.commit();
    }

    //隐藏所有的fragment
    private void hideFragment(FragmentTransaction transaction) {
        if (findFragment != null) {
            transaction.hide(findFragment);
        }
        if (newsFragment != null) {
            transaction.hide(newsFragment);
        }
        if (optionalFragment != null) {
            transaction.hide(optionalFragment);
        }
    }

    //点击两次，退出app
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK
                && event.getAction() == KeyEvent.ACTION_DOWN) {
            if ((System.currentTimeMillis() - exitTime) > 2000) {
                ToastUtils.showShort(MainActivity.this, "再按一次退出程序");
                exitTime = System.currentTimeMillis();
            } else {
                onBackPressed();
            }
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
