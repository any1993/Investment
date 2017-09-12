package com.taikor.investment.optional;

import android.content.Intent;
import android.text.TextUtils;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.utils.ToastUtils;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 创建组合
 * Created by Any on 2017/4/13.
 */
public class CreateGroupActivity extends BaseActivity {


    @BindView(R.id.tv_top_bar_left)
    TextView tvBack;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTitle;
    @BindView(R.id.tv_top_bar_right2)
    TextView tvNext;
    @BindView(R.id.et_group_name)
    EditText etGroupName;
    @BindView(R.id.et_group_desc)
    EditText etGroupDesc;
    @BindView(R.id.et_invest_money)
    EditText etInvestMoney;
    @BindView(R.id.cb_share)
    CheckBox cbShare;


    @Override
    public int getLayoutResource() {
        return R.layout.activity_create_group;
    }

    @Override
    public void initView() {
        tvBack.setBackgroundResource(R.drawable.backup);
        tvTitle.setText("创建组合");
        tvTitle.setCompoundDrawables(null, null, null, null);
        tvNext.setText("下一步");
        tvNext.setBackground(null);
        tvNext.setVisibility(View.VISIBLE);
    }

    @OnClick({R.id.tv_top_bar_left, R.id.tv_top_bar_right2})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                finish();
                break;
            case R.id.tv_top_bar_right2:
                transmitData();
                break;
        }
    }

    //传递数据
    private void transmitData() {
        String portfolioName = etGroupName.getText().toString();
        String investmentAmount = etInvestMoney.getText().toString();

        if (TextUtils.isEmpty(portfolioName) || TextUtils.isEmpty(investmentAmount)) {
            ToastUtils.showShort(CreateGroupActivity.this, "组合名称和投资金额不能为空");
            return;
        }

//        Intent intent = new Intent(CreateGroupActivity.this, SetRepoActivity.class);
        Intent intent = new Intent(CreateGroupActivity.this, OptionProductActivity.class);
        intent.putExtra("portfolio_name", portfolioName);
        intent.putExtra("description", etGroupDesc.getText().toString());
        intent.putExtra("investment_amount", investmentAmount);
        intent.putExtra("share", cbShare.isChecked());
        intent.putExtra("from","create");
        startActivity(intent);
    }
}
