package com.taikor.investment.user;

import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.BaseActivity;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 用户
 * Created by Any on 2017/7/31.
 */

public class UserActivity extends BaseActivity {

    @BindView(R.id.ib_user_back)
    ImageButton ibUserBack;
    @BindView(R.id.iv_user_photo)
    ImageView ivUserPhoto;
    @BindView(R.id.tv_user_identify)
    TextView tvUserIdentify;
    @BindView(R.id.tv_user_code)
    TextView tvUserCode;
    @BindView(R.id.bt_bind_phone)
    Button btBindPhone;
    @BindView(R.id.ib_feedback)
    ImageButton ibFeedback;
    @BindView(R.id.ib_about_us)
    ImageButton ibAboutUs;
    @BindView(R.id.ib_setting)
    ImageButton ibSetting;

    @Override
    public int getLayoutResource() {
        return R.layout.activity_user;
    }

    @Override
    protected void initView() {
       
    }

    @OnClick({R.id.ib_user_back, R.id.iv_user_photo,R.id.bt_bind_phone, R.id.ib_feedback, R.id.ib_about_us, R.id.ib_setting})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.ib_user_back:
                finish();
                break;
            case R.id.iv_user_photo:
                break;
            case R.id.bt_bind_phone:
                break;
            case R.id.ib_feedback:
                break;
            case R.id.ib_about_us:
                break;
            case R.id.ib_setting:
                break;
        }
    }
}
