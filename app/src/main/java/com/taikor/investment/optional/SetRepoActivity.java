package com.taikor.investment.optional;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
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
import com.taikor.investment.adapter.RepoFundAdapter;
import com.taikor.investment.adapter.RepoStockAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.OutputResult;
import com.taikor.investment.bean.PostGroup;
import com.taikor.investment.bean.PostProduct;
import com.taikor.investment.bean.Product;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.event.AllDataEvent;
import com.taikor.investment.event.ProductEvent;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

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
        implements RepoFundAdapter.MyFunListener, RepoStockAdapter.MyStockListener, View.OnClickListener {

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
    @BindView(R.id.ll_selected_fund)
    LinearLayout llFund;
    @BindView(R.id.lv_selected_fund)
    ListView lvFundView;
    @BindView(R.id.ll_selected_stock)
    LinearLayout llStock;
    @BindView(R.id.lv_selected_stock)
    ListView lvStockView;
    @BindView(R.id.progress)
    ProgressBar progress;
    @BindView(R.id.tv_cache_grey)
    TextView tvCacheGrey;
    @BindView(R.id.bt_save)
    Button btSave;

    private ArrayList<PostProduct> products = new ArrayList<>();//上传的产品集合
    private String portfolioName, description;
    private boolean share, flag;
    private int benchMark = 1;
    private double investmentAmount;
    private int repoPosition;
    private static int stockSumRepo, fundSumRepo;

    private boolean isStockClick = true;
    private RepoFundAdapter fundAdapter;
    private RepoStockAdapter stockAdapter;
    private NumberPickerView picker;
    private PopupWindow markPopup, fundPopup;
    private  ArrayList<Stock> allStockList = new ArrayList<>();
    private  ArrayList<Product> allFundList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.activity_set_repo;
    }

    @Override
    public void initView() {
        //初始化界面
        tvBack.setBackground(null);
        tvBack.setText("上一步");
        tvTitle.setText("添加产品");
        tvTitle.setCompoundDrawables(null, null, null, null);
        tvAddProduct.setText("继续添加");
        tvAddProduct.setBackground(null);
        tvAddProduct.setVisibility(View.VISIBLE);

        stockAdapter = new RepoStockAdapter(this);
        fundAdapter = new RepoFundAdapter(this);
        initFundPop();
        initMarkPop();
    }

    //初始化数字选择弹出框
    public void initFundPop() {
        final View view = LayoutInflater.from(this).inflate(R.layout.ppw_fund, null);
        fundPopup = new PopupWindow(view, WindowManager.LayoutParams.MATCH_PARENT,
                WindowManager.LayoutParams.WRAP_CONTENT, true);
        fundPopup.setTouchable(true);
        fundPopup.setOutsideTouchable(true);
        fundPopup.setAnimationStyle(R.style.pop_anim);
        fundPopup.setOnDismissListener(new DismissListener());
        fundPopup.setBackgroundDrawable(ContextCompat.getDrawable(this, android.R.color.transparent));
        TextView sure = view.findViewById(R.id.fund_sure);
        TextView cancel = view.findViewById(R.id.fund_cancel);
        picker = view.findViewById(R.id.fund_picker);
        cancel.setOnClickListener(this);
        sure.setOnClickListener(this);
    }

    // 初始化基准选择弹出框
    public void initMarkPop() {
        View view = getLayoutInflater().inflate(R.layout.ppw_mark, null);
        int height = CommonUtils.getScreenHeight();
        markPopup = new PopupWindow(view, WindowManager.LayoutParams.MATCH_PARENT,
                height - CommonUtils.dip2px(135), true);
        markPopup.setTouchable(true);
        markPopup.setOutsideTouchable(true);
        markPopup.setOnDismissListener(new DismissListener());
        markPopup.setBackgroundDrawable(ContextCompat.getDrawable(this, android.R.color.transparent));
        TextView tvHu = view.findViewById(R.id.tv_hu);
        TextView tvGang = view.findViewById(R.id.tv_gang);
        TextView tvMei = view.findViewById(R.id.tv_mei);
        View v = view.findViewById(R.id.view_mark);
        v.setOnClickListener(this);
        tvHu.setOnClickListener(this);
        tvMei.setOnClickListener(this);
        tvGang.setOnClickListener(this);
    }

    // 将背景透明度改回来
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

    //页面点击事件
    @OnClick({R.id.tv_top_bar_left, R.id.tv_top_bar_right2, R.id.tv_mark, R.id.bt_save})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left://返回
                finish();
                break;
            case R.id.tv_top_bar_right2://继续添加产品
                transmitData();
                break;
            case R.id.tv_mark://弹出基准选择框
                markPopup.showAsDropDown(tvMark);
                break;
            case R.id.bt_save://上传数据到服务器
                postGroupData(Constant.NEW_GROUP);
                break;
        }
    }

    //基准弹出框和数字弹出框中的点击事件
    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.tv_hu:
                tvMark.setText("沪深300");
                benchMark = 1;
                markPopup.dismiss();
                break;
            case R.id.tv_mei:
                tvMark.setText("美股");
                benchMark = 2;
                markPopup.dismiss();
                break;
            case R.id.tv_gang:
                tvMark.setText("港股");
                benchMark = 3;
                markPopup.dismiss();
                break;
            case R.id.view_mark:
                markPopup.dismiss();
                break;
            case R.id.fund_cancel:
                //弹出框消失，恢复透明度
                fundPopup.dismiss();
                setAlpha(1.0f);
                break;
            case R.id.fund_sure:
                //恢复透明度
                fundPopup.dismiss();
                setAlpha(1.0f);
                //设置仓位，提示信息，更新进度
                if (isStockClick) {
                    setStockRepo(repoPosition, getPickerValue());
                } else {
                    setFundRepo(repoPosition, getPickerValue());
                }
                break;
        }
    }

    //股票设置回调
    @Override
    public void clickStockItem(int position) {
        isStockClick = true;
        repoPosition = position;
        //获取所有股票和基金仓位的值
        int stockSum = getStockRepoValue(allStockList.size());
        int fundSum = getFunRepoValue(allFundList.size());

        TextView repoView = lvStockView.getChildAt(position).findViewById(R.id.stock_repo);
        int repoCurrentValue = Integer.valueOf(repoView.getText().toString());

        int leftSum = stockSum + fundSum - repoCurrentValue;
        //刷新数字选择器的最大值
        picker.refreshByNewDisplayedValues(initDisplayValue(100 - leftSum));
        fundPopup.showAtLocation(SetRepoActivity.this.findViewById(R.id.ll_repo), Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL, 0, 0);
    }

    //股票删除回调
    @Override
    public void deleteStock(int position) {
        int sum = 0;
        List<String> valueList = new ArrayList<>();
        if (allStockList.size() != 0) {
            for (int i = 0; i < allStockList.size(); i++) {
                TextView textview = lvStockView.getChildAt(i).findViewById(R.id.stock_repo);
                valueList.add(textview.getText().toString());
            }
        }
        allStockList.remove(position);
        valueList.remove(position);
        stockAdapter.setData(allStockList, valueList);
        //移除之后重新计算剩余仓位的值，更新界面
        for (int i = 0; i < valueList.size(); i++) {
            int value = Integer.valueOf(valueList.get(i));
            sum = sum + value;
        }
        updateInfo(sum, getFunRepoValue(allFundList.size()));
    }

    //基金设置回调
    @Override
    public void clickFundItem(int position) {
        isStockClick = false;
        repoPosition = position;
        //获取所有股票和基金仓位的值
        int stockSum = getStockRepoValue(allStockList.size());
        int fundSum = getFunRepoValue(allFundList.size());

        TextView repoView = lvFundView.getChildAt(position).findViewById(R.id.fund_repo);
        int repoCurrentValue = Integer.valueOf(repoView.getText().toString());

        int leftSum = stockSum + fundSum - repoCurrentValue;
        //刷新数字选择器的最大值
        picker.refreshByNewDisplayedValues(initDisplayValue(100 - leftSum));
        fundPopup.showAtLocation(SetRepoActivity.this.findViewById(R.id.ll_repo), Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL, 0, 0);
    }

    //基金删除回调
    @Override
    public void deleteFund(int position) {
        int sum = 0;
        List<String> valueList = new ArrayList<>();

        if (allFundList.size() != 0) {
            for (int i = 0; i < allFundList.size(); i++) {
                TextView textview = lvFundView.getChildAt(i).findViewById(R.id.fund_repo);
                valueList.add(textview.getText().toString());
            }
        }
        allFundList.remove(position);
        valueList.remove(position);
        fundAdapter.setData(allFundList, valueList);
        //移除之后重新计算剩余仓位的值，更新界面
        for (int i = 0; i < valueList.size(); i++) {
            int value = Integer.valueOf(valueList.get(i));
            sum = sum + value;
        }
        updateInfo(getStockRepoValue(allStockList.size()), sum);
    }

    // 根据最大值，重新刷新填充数据
    public String[] initDisplayValue(int max) {
        List<String> list = new ArrayList();
        for (int i = 0; i < max; i++) {
            list.add(String.valueOf(i + 1));
        }
        return list.toArray(new String[max]);
    }

    // 获取当前选择器的值
    private String getPickerValue() {
        String[] content = picker.getDisplayedValues();
        return content[picker.getValue() - picker.getMinValue()];
    }

    //更新界面提示信息
    private void updateInfo(int stockRepo, int fundRepo) {
        progress.setProgress(100 - stockRepo - fundRepo);//100-传递的值的和
        tvCacheGrey.setText(100 - stockRepo - fundRepo + "%");//sum最大100
        tvAdvice.setText("你一共选择了" + allStockList.size() + "只股票,仓位为" + stockRepo + "%," + allFundList.size() + "只基金,仓位为" + fundRepo + "%");
    }

    //设置基金仓位
    public void setStockRepo(int position, String proportion) {
        TextView textview = lvStockView.getChildAt(position).findViewById(R.id.stock_repo);
        textview.setText(proportion);
        //设置之后重新计算现有仓位的值,更新界面
        updateInfo(getStockRepoValue(allStockList.size()), getFunRepoValue(allFundList.size()));
    }

    //设置基金仓位
    public void setFundRepo(int position, String proportion) {
        TextView textview = lvFundView.getChildAt(position).findViewById(R.id.fund_repo);
        textview.setText(proportion);
        //设置之后重新计算现有仓位的值,更新界面
        updateInfo(getStockRepoValue(allStockList.size()), getFunRepoValue(allFundList.size()));
    }


    //获取股票和基金所有的仓位值
    public int getStockRepoValue(int allStockSize) {
        int stockSum = 0;
        for (int i = 0; i < allStockSize; i++) {
            //获取对应的Text中的值
            TextView repoView = lvStockView.getChildAt(i).findViewById(R.id.stock_repo);
            int proportion = Integer.valueOf(repoView.getText().toString());
            stockSum = stockSum + proportion;
        }
        return stockSum;
    }

    //获取股票和基金所有的仓位值
    public int getFunRepoValue(int allFundSize) {
        int fundSum = 0;
        for (int i = 0; i < allFundSize; i++) {
            //获取对应的Text中的值
            TextView repoView = lvFundView.getChildAt(i).findViewById(R.id.fund_repo);
            int proportion = Integer.valueOf(repoView.getText().toString());
            fundSum = fundSum + proportion;
        }

        return fundSum;
    }

    //跳转添加产品
    private void transmitData() {
        stockSumRepo = getStockRepoValue(allStockList.size());
        fundSumRepo = getFunRepoValue(allFundList.size());

        //跳转前，所有条目的状态保存下来
        if (allStockList.size() != 0) {
            List<String> valueList = new ArrayList<>();
            for (int i = 0; i < allStockList.size(); i++) {
                TextView textview = lvStockView.getChildAt(i).findViewById(R.id.stock_repo);
                valueList.add(textview.getText().toString());
            }
            AppApplication.getInstance().put("stock_list", valueList);
        }

        //跳转前，所有条目的状态保存下来
        if (allFundList.size() != 0) {
            List<String> valueList = new ArrayList<>();
            for (int i = 0; i < allFundList.size(); i++) {
                TextView textview = lvFundView.getChildAt(i).findViewById(R.id.fund_repo);
                valueList.add(textview.getText().toString());
            }
            AppApplication.getInstance().put("fund_list", valueList);
        }

        Intent intent = new Intent(this, OptionProductActivity.class);
        intent.putExtra("from", "set");
        startActivity(intent);
        EventBus.getDefault().post(new ProductEvent());
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void getAllData(AllDataEvent event) {
        flag = event.isFlag();
        ArrayList<Stock> stocks = event.getStocks();
        ArrayList<Product> products = event.getProducts();
        if (!flag) {
            portfolioName = event.getPortfolioName();
            description = event.getDescription();
            share = event.isShare();
            investmentAmount = Integer.valueOf(event.getInvestmentAmount());
            //设置界面
            allStockList.clear();
            allStockList.addAll(stocks);
            stockAdapter.setData(allStockList, null);
            lvStockView.setAdapter(stockAdapter);
            if (allStockList.size() > 0)
                llStock.setVisibility(View.VISIBLE);

            allFundList.clear();
            allFundList.addAll(products);
            fundAdapter.setData(allFundList, null);
            lvFundView.setAdapter(fundAdapter);
            if (allFundList.size() > 0)
                llFund.setVisibility(View.VISIBLE);

            tvAdvice.setText("你一共选择了" + stocks.size() + "只股票,仓位为0%," + products.size() + "只基金,仓位为0%");

        } else {
            for (int i = 0; i < stocks.size(); i++) {
                allStockList.add(allStockList.size(), stocks.get(i));
            }
            for (int i = 0; i < products.size(); i++) {
                allFundList.add(allFundList.size(), products.get(i));
            }

            //从暂存区读取保存的map
            List<String> saveStockList = (List<String>) AppApplication.getInstance().get("stock_list");
            List<String> saveFundList = (List<String>) AppApplication.getInstance().get("fund_list");
            //设置给适配器
            stockAdapter.setData(allStockList, saveStockList);
            lvStockView.setAdapter(stockAdapter);
            llStock.setVisibility(View.VISIBLE);

            fundAdapter.setData(allFundList, saveFundList);
            lvFundView.setAdapter(fundAdapter);
            llFund.setVisibility(View.VISIBLE);

            //更新界面
            tvAdvice.setText("你一共选择了" + allStockList.size() + "只股票,仓位为" + stockSumRepo
                    + "%," + allFundList.size() + "只基金,仓位为" + fundSumRepo + "%");
        }
    }


    //注册事件总线
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EventBus.getDefault().register(this);
    }

    //解除事件总线
    @Override
    public void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }

    //上传新建的组合
    public void postGroupData(final String url) {
        for (int i = 0; i < allFundList.size(); i++) {
            PostProduct pros = new PostProduct();
            //获取对应的Text中的值
            TextView repoView = lvFundView.getChildAt(i).findViewById(R.id.fund_repo);
            String s = repoView.getText().toString();
            double proportion = Integer.valueOf(s) / 100.0;
            double amount = investmentAmount * proportion;
            String productID = allFundList.get(i).getProductID();
            String productName = allFundList.get(i).getProductName();
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
        OkGo.<OutputResult>post(url)
                .upJson(s)
                .execute(new JsonCallBack<OutputResult>(OutputResult.class) {
                    @Override
                    public void onSuccess(com.lzy.okgo.model.Response<OutputResult> response) {
                        if (response.body() == null) return;
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
