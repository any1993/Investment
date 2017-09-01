package com.taikor.investment.optional;

import android.content.Intent;
import android.graphics.drawable.BitmapDrawable;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.google.gson.Gson;
import com.lzy.okgo.OkGo;
import com.taikor.investment.AppApplication;
import com.taikor.investment.R;
import com.taikor.investment.adapter.RepoAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.OutputResult;
import com.taikor.investment.bean.PostGroup;
import com.taikor.investment.bean.PostProduct;
import com.taikor.investment.bean.Product;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;
import cn.carbswang.android.numberpickerview.library.NumberPickerView;

/**
 * 设置仓位,第一次进入为空
 * Created by Any on 2017/4/14.
 */

public class SetRepoActivity extends BaseActivity
        implements RepoAdapter.MyListener, View.OnClickListener {

    @BindView(R.id.tv_top_bar_left)
    TextView tvBack;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTitle;
    @BindView(R.id.tv_top_bar_right2)
    TextView tvAddProduct;
    @BindView(R.id.tv_advice)
    TextView tvAdvice;
    @BindView(R.id.tv_mark)
    TextView tvMark;
    @BindView(R.id.ll_product_repo)
    LinearLayout llProductRepo;
    @BindView(R.id.lv_selected)
    ListView lvSelected;
    @BindView(R.id.progress)
    ProgressBar progress;
    @BindView(R.id.tv_cache_grey)
    TextView tvCacheGrey;
    @BindView(R.id.bt_save)
    Button btSave;

    private NumberPickerView picker;
    private PopupWindow pop, window;//基准弹出框，window：NumberPicker弹出框
    private RepoAdapter adapter = null;
    private ArrayList<PostProduct> products = new ArrayList<>();//上传的产品集合
    private ArrayList<Product> productList = new ArrayList<>();//接收传递过来的参数
    private String portfolioName = null, description = null;
    private boolean share;
    private int benchMark = 1;
    private double investmentAmount;
    private int repoPosition, repoSum = 0;
    private static String TAG = "SetRepoActivity";

    @Override
    public int getLayoutResource() {
        return R.layout.activity_set_repo;
    }

    @Override
    public void initView() {

        //获取传递的数据
        Intent intent = getIntent();
        portfolioName = intent.getStringExtra("portfolio_name");
        description = intent.getStringExtra("description");
        investmentAmount = Double.valueOf(intent.getStringExtra("investment_amount"));
        share = intent.getBooleanExtra("share", false);

        //初始化界面
        tvBack.setBackground(null);
        tvBack.setText("上一步");
        tvTitle.setText("添加产品");
        tvTitle.setCompoundDrawables(null, null, null, null);
        tvAddProduct.setText("添加");
        tvAddProduct.setBackground(null);
        tvAddProduct.setVisibility(View.VISIBLE);
        btSave.getBackground().setAlpha(125);
        tvAdvice.setText("你一共选择了0只产品，仓位为0%");

        adapter = new RepoAdapter(this);
        initNumberPickerPop();
        initMarkPop();
    }

    @OnClick({R.id.tv_top_bar_left, R.id.tv_top_bar_right2, R.id.tv_mark, R.id.bt_save})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left://返回
                finish();
                break;
            case R.id.tv_top_bar_right2://跳转到添加产品
                transmitData();
                break;
            case R.id.tv_mark://弹出选择框
                pop.showAsDropDown(tvMark);
                break;
            case R.id.bt_save:
                //1，上传数据到服务器
                postGroupData(Constant.NEW_GROUP);
                break;
        }
    }

    //初始化NumberPicker弹出框
    public void initNumberPickerPop() {
        //创建popupWindow对象
        final View pop = LayoutInflater.from(this).inflate(R.layout.ppw_number_picker, null);
        //初始化popupWindow对象
        window = new PopupWindow(pop, WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.WRAP_CONTENT, true);
        //点击其他位置，popupWindow消失
        window.setBackgroundDrawable(new BitmapDrawable());
        window.setTouchable(true);
        window.setOutsideTouchable(true);
        window.setOnDismissListener(new DismissListener());
        window.setAnimationStyle(R.style.pop_anim);
        //初始化popupWindow的布局中的其他控件
        TextView sure = (TextView) pop.findViewById(R.id.tv_repo_sure);
        TextView cancel = (TextView) pop.findViewById(R.id.tv_repo_cancel);
        picker = (NumberPickerView) pop.findViewById(R.id.picker);
        cancel.setOnClickListener(this);
        sure.setOnClickListener(this);
    }

    // 初始化基准选择弹出框
    public void initMarkPop() {
        //创建popupWindow对象
        View view = getLayoutInflater().inflate(R.layout.ppw_mark, null);
        //获取屏幕的大小
        int width = CommonUtils.getScreenWidth();
        int height = CommonUtils.getScreenHeight();
        //初始化popupWindow对象
        pop = new PopupWindow(view, width, height - CommonUtils.dip2px(135), true);
        //点击其他位置，popupWindow消失
        pop.setTouchable(true);
        pop.setOutsideTouchable(true);
        pop.setBackgroundDrawable(ContextCompat.getDrawable(this, android.R.color.transparent));
        pop.setOnDismissListener(new DismissListener());
        TextView tvHu = (TextView) view.findViewById(R.id.tv_hu);
        TextView tvGang = (TextView) view.findViewById(R.id.tv_gang);
        TextView tvMei = (TextView) view.findViewById(R.id.tv_mei);
        View v = view.findViewById(R.id.view_mark);
        v.setOnClickListener(this);
        tvHu.setOnClickListener(this);
        tvMei.setOnClickListener(this);
        tvGang.setOnClickListener(this);
    }

    // 根据最大值，重新刷新填充数据
    public String[] initDisplayValue(int max) {
        List<String> list = new ArrayList();
        for (int i = 0; i < max; i++) {
            list.add(String.valueOf(i + 1));
        }
        return list.toArray(new String[max]);
    }

    // 获取当前的值
    private String getCurrentContent() {
        String[] content = picker.getDisplayedValues();
        return content[picker.getValue() - picker.getMinValue()];
    }

    //  popupWindow的弹出框中的点击事件
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.tv_hu:
                tvMark.setText("沪深300");
                benchMark = 1;
                pop.dismiss();
                break;
            case R.id.tv_mei:
                tvMark.setText("美股");
                benchMark = 2;
                pop.dismiss();
                break;
            case R.id.tv_gang:
                tvMark.setText("港股");
                benchMark = 3;
                pop.dismiss();
                break;
            case R.id.view_mark:
                pop.dismiss();
                break;
            case R.id.tv_repo_cancel:
                //弹出框消失，恢复透明度
                window.dismiss();
                setAlpha(1.0f);
                break;
            case R.id.tv_repo_sure:
                //恢复透明度
                window.dismiss();
                setAlpha(1.0f);
                //设置仓位，提示信息，更新进度
                setData(repoPosition, getCurrentContent());
                break;
        }
    }

    /**
     * 设置仓位
     *
     * @param position   修改的仓位的位置
     * @param proportion 仓位的值
     */
    public void setData(int position, String proportion) {
        TextView textview = (TextView) lvSelected.getChildAt(position).findViewById(R.id.tv_repo);
        textview.setText(proportion);
        //设置之后重新计算现有仓位的值,更新界面
        updateInfo(getRepoValue(productList.size()));
    }

    //删除条目回调接口
    @Override
    public void delete(int position) {
        int sum = 0;
        List<String> valueList = new ArrayList<>();

        if (productList.size() != 0) {
            for (int i = 0; i < productList.size(); i++) {
                TextView textview = (TextView) lvSelected.getChildAt(i).findViewById(R.id.tv_repo);
                valueList.add(textview.getText().toString());
            }
        }
        productList.remove(position);
        valueList.remove(position);
        adapter.setData(productList, valueList);
        //移除之后重新计算剩余仓位的值，更新界面
        for (int i = 0; i < valueList.size(); i++) {
            int value = Integer.valueOf(valueList.get(i));
            sum = sum + value;
        }
        updateInfo(sum);
    }

    /**
     * 更新界面提示信息
     *
     * @param repoSum 仓位的总和
     */
    private void updateInfo(int repoSum) {
        progress.setProgress(100 - repoSum);//100-传递的值的和
        tvCacheGrey.setText(100 - repoSum + "%");//sum最大100
        tvAdvice.setText("你一共选择了" + productList.size() + "只产品，仓位为" + repoSum + "%");
    }

    /**
     * 获取现有产品集合中，所有仓位的值
     *
     * @return 条目的数量
     */
    private int getRepoValue(int size) {
        int repoSum = 0;
        for (int i = 0; i < size; i++) {
            //获取对应的Text中的值
            LinearLayout layout = (LinearLayout) lvSelected.getChildAt(i);
            TextView repoView = (TextView) layout.findViewById(R.id.tv_repo);
            String s = repoView.getText().toString();
            int proportion = Integer.valueOf(s);
            repoSum = repoSum + proportion;
        }
        return repoSum;
    }

    /**
     * 显示设置仓位弹出框，在这里设置最大值
     *
     * @param position 条目的索引
     */
    @Override
    public void setRepo(int position) {
        repoPosition = position;
        //获取现有仓位的值
        int repoSum = getRepoValue(productList.size());
        TextView repoView = (TextView) lvSelected.getChildAt(position).findViewById(R.id.tv_repo);
        int repoCurrentValue = Integer.valueOf(repoView.getText().toString());
        int leftSum = repoSum - repoCurrentValue;
        picker.refreshByNewDisplayedValues(initDisplayValue(100 - leftSum));
        //显示在底部
        window.showAtLocation(SetRepoActivity.this.findViewById(R.id.ll_repo), Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL, 0, 0);
    }

    //    接受回传的数据——选中的产品集合
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK) {
            //从暂存区读取保存的map
            btSave.getBackground().setAlpha(255);//设置半透明
            //获取选中的产品集合
            ArrayList<Product> products_list = (ArrayList<Product>) data.getSerializableExtra("products_list");
            for (int i = 0; i < products_list.size(); i++) {
                productList.add(productList.size(), products_list.get(i));
            }

            List<String> list = (List<String>) AppApplication.getInstance().get("list");
            //设置给适配器
            adapter.setData(productList, list);
            lvSelected.setAdapter(adapter);
            //显示界面
            llProductRepo.setVisibility(View.VISIBLE);

            //获取所有产品的仓位值
            tvAdvice.setText("你一共选择了" + productList.size() + "只产品，仓位为" + repoSum + "%");
        }
    }

    /**
     * 将背景透明度改回来
     */
    private class DismissListener implements PopupWindow.OnDismissListener {
        @Override
        public void onDismiss() {
            setAlpha(1f);
        }
    }

    //设置透明度
    private void setAlpha(float alpha) {
        Window window = getWindow();
        WindowManager.LayoutParams params = window.getAttributes();
        params.alpha = alpha;
        window.setAttributes(params);
    }

    //跳转添加产品
    private void transmitData() {
        //保存设置的仓位
        if (productList.size() != 0) {
            List<String> valueList = new ArrayList<>();
            for (int i = 0; i < productList.size(); i++) {
                //把第二次跳转前，所有条目的状态保存下来
                TextView textview = (TextView) lvSelected.getChildAt(i).findViewById(R.id.tv_repo);
                valueList.add(textview.getText().toString());
            }
            //保存到暂存区
            AppApplication.getInstance().put("list", valueList);
        }
        Intent intent = new Intent(this, ProductActivity.class);
        startActivityForResult(intent, 100);
        repoSum = getRepoValue(productList.size());
    }

    //上传新建的组合
    public void postGroupData(final String url) {
        for (int i = 0; i < productList.size(); i++) {
            PostProduct pros = new PostProduct();
            //获取对应的Text中的值
            TextView repoView = (TextView) lvSelected.getChildAt(i).findViewById(R.id.tv_repo);
            String s = repoView.getText().toString();
            double proportion = Integer.valueOf(s) / 100.0;
            double amount = investmentAmount * proportion;
            String productID = productList.get(i).getProductID();
            String productName = productList.get(i).getProductName();
            pros.setProductID(productID);
            pros.setProductName(productName);
            pros.setProportion(proportion);
            pros.setPurchaseAmount(amount);
            products.add(pros);

        }
        PostGroup groups = new PostGroup();
        groups.setUserID("20000");
        groups.setPortfolioName(portfolioName);
        groups.setDescription(description);
        groups.setInvestmentAmount(investmentAmount);
        groups.setBenchmark(benchMark);
        groups.setShare(share);
        groups.setType(3);
        groups.setProductType(3);
        groups.setProducts(products);

        Gson gson = new Gson();
        String s = gson.toJson(groups);
        Log.d(TAG,s);
        OkGo.<OutputResult>post(url)
                .upJson(s)
                .execute(new JsonCallBack<OutputResult>(OutputResult.class) {
                    @Override
                    public void onSuccess(com.lzy.okgo.model.Response<OutputResult> response) {
                        if (response == null) return;
                        OutputResult result = response.body();
                        if (result.isSuccess()) {
                            Intent intent = new Intent(SetRepoActivity.this, GroupDescActivity.class);
                            intent.putExtra("itemId", result.getData().getGroupId());
                            startActivity(intent);
                            finish();
                        }
                    }
                });
    }

}
