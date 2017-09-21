package com.taikor.investment.optional;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;

import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.OptionFundAdapter;
import com.taikor.investment.adapter.ProductAdapter;
import com.taikor.investment.adapter.SearchStockAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.Product;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.event.AllDataEvent;
import com.taikor.investment.event.ProductEvent;
import com.taikor.investment.event.SearchEvent;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;
import com.taikor.investment.utils.ToastUtils;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 自选产品
 * Created by Any on 2017/9/5.
 */

public class OptionProductActivity extends BaseActivity {

    @BindView(R.id.tv_top_bar_left)
    TextView tvBack;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTitle;
    @BindView(R.id.tv_top_bar_right2)
    TextView tvNext;
    @BindView(R.id.rb_optional_stock)
    RadioButton rbStock;
    @BindView(R.id.rb_optional_fund)
    RadioButton rbFund;
    @BindView(R.id.rlv_optional_stock)
    RecyclerView rlvStock;
    @BindView(R.id.rlv_optional_fund)
    RecyclerView rlvFund;
    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.ll_stock)
    LinearLayout llStock;
    @BindView(R.id.ll_fund)
    LinearLayout llFund;

    private boolean share;
    private String token, portfolioName, description, investmentAmount, from;
    private SearchStockAdapter stockAdapter;
    private OptionFundAdapter fundAdapter;
    private List<Product> productList = new ArrayList<>();
    private List<Stock> stockList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.activity_optional_product;
    }

    @Override
    protected void initView() {

        token = SharedPreferenceUtils.getString(this, "token", "");

        tvBack.setBackgroundResource(R.drawable.backup);
        tvTitle.setText("自选产品");
        tvTitle.setCompoundDrawables(null, null, null, null);
        tvNext.setText("下一步");
        tvNext.setBackground(null);
        tvNext.setVisibility(View.VISIBLE);

        stockAdapter = new SearchStockAdapter(this);
        stockAdapter.setShow(true);
        rlvStock.setAdapter(stockAdapter);
        rlvStock.setLayoutManager(new LinearLayoutManager(this));
        rlvStock.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));

        fundAdapter = new OptionFundAdapter(this);
        rlvFund.setAdapter(fundAdapter);
        rlvFund.setLayoutManager(new LinearLayoutManager(this));
        rlvFund.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));
    }

    @Override
    public void initData() {

        Intent intent = getIntent();
        portfolioName = intent.getStringExtra("portfolio_name");
        description = intent.getStringExtra("description");
        investmentAmount = intent.getStringExtra("investment_amount");
        share = intent.getBooleanExtra("share", false);
        from = intent.getStringExtra("from");

        getStockData();
        getThemeData();
    }

    //获取股票数据
    private void getStockData() {
        Type type = new TypeToken<List<Stock>>() {
        }.getType();

        OkGo.<List<Stock>>get(Constant.USER_STOCK)
                .tag(this)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)//br_1838525384
                .execute(new JsonCallBack<List<Stock>>(type) {
                    @Override
                    public void onSuccess(Response<List<Stock>> response) {
                        if (response.body() == null) return;
                        stockList = response.body();

                        if (stockList.size() == 0) {
                            emptyView.setVisibility(View.VISIBLE);
                            return;
                        }
                        stockAdapter.clear();
                        stockAdapter.addAll(stockList);
                    }
                });
    }

    //获取基金数据
    private void getThemeData() {

        productList.add(new Product("269465", "同庆1期", 0, 0));
        productList.add(new Product("13608", "海通海汇星石1号", 0.80, 1.8048));
        productList.add(new Product("251474", "星石优粤语10号2期", 0.04, 1.0387));
        productList.add(new Product("254941", "证大量化1号", 0.01, 1.0080));
        productList.add(new Product("247404", "证大创新1号", 0, 0));
        productList.add(new Product("240932", "证大量化稳健8号", 0, 0));
        productList.add(new Product("232015", "证大新视野", 0, 0));
        productList.add(new Product("8477", "乐瑞强债1号", 0.90, 1.8968));
        productList.add(new Product("31090", "乐瑞强债5号", 0.67, 1.6699));
        productList.add(new Product("54480", "乐瑞强债10号", 0.31, 1.3063));

        fundAdapter.addAll(productList);
    }

    @OnClick({R.id.tv_search, R.id.tv_top_bar_left, R.id.tv_top_bar_right2, R.id.rb_optional_stock, R.id.rb_optional_fund})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_search://搜索产品
                Intent searchIntent = new Intent(OptionProductActivity.this, ProductActivity.class);
//                AllDataEvent event = new AllDataEvent();
//                ArrayList<Stock> stockList = stockAdapter.getSelectedItem();
//                ArrayList<Product> fundList = fundAdapter.getSelectedItem();
//                if (stockList.size() > 0) {
//                    event.setStocks(stockList);
//                }
//                if (fundList.size() > 0) {
//                    event.setProducts(fundList);
//                }
//                if (from.equals("create")) {
//                    event.setPortfolioName(portfolioName);
//                    event.setDescription(description);
//                    event.setInvestmentAmount(investmentAmount);
//                    event.setShare(share);
//                    event.setFlag(false);
//                } else if (from.equals("set")) {
//                    event.setFlag(true);
//                    finish();
//                }
                startActivity(searchIntent);
//                EventBus.getDefault().postSticky(event);

                break;
            case R.id.tv_top_bar_left://返回
                finish();
                break;
            case R.id.tv_top_bar_right2://下一步
                Intent setIntent = new Intent(OptionProductActivity.this, SetRepoActivity.class);
                AllDataEvent allDataEvent = new AllDataEvent();
                ArrayList<Stock> stocks = stockAdapter.getSelectedItem();
                ArrayList<Product> products = fundAdapter.getSelectedItem();
                if (stocks.size() == 0 && products.size() == 0) {
                    ToastUtils.showShort(OptionProductActivity.this, "您还没有选择任何产品！");
                    return;
                }

                if (stocks.size() > 0) {
                    allDataEvent.setStocks(stocks);
                }
                if (products.size() > 0) {
                    allDataEvent.setProducts(products);
                }
//                if (from.equals("create")) {
                    allDataEvent.setPortfolioName(portfolioName);
                    allDataEvent.setDescription(description);
                    allDataEvent.setInvestmentAmount(investmentAmount);
                    allDataEvent.setShare(share);
//                    allDataEvent.setFlag(false);
                    EventBus.getDefault().postSticky(allDataEvent);
                    startActivity(setIntent);
//                } else if (from.equals("set")) {
//                    allDataEvent.setFlag(true);
//                    EventBus.getDefault().postSticky(allDataEvent);
//                    finish();
//                }
                break;
            case R.id.rb_optional_stock:
                llStock.setVisibility(View.VISIBLE);
                llFund.setVisibility(View.GONE);
                break;
            case R.id.rb_optional_fund:
                llStock.setVisibility(View.GONE);
                llFund.setVisibility(View.VISIBLE);
                break;
        }
    }

    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
    public void getData(SearchEvent event) {
        ArrayList<Stock> stocks = event.getStocks();
        ArrayList<Product> products = event.getProducts();
        if(stocks.size()!=0){
            for(int i=0;i<stocks.size();i++){
                stockList.add(stocks.get(i));
            }
        }
        stockAdapter.clear();
        stockAdapter.addAll(stockList);
        stockAdapter.notifyDataSetChanged();

        if(products.size()!=0){
            for (int i=0;i<products.size();i++){
                productList.add(products.get(i));
            }
        }
        fundAdapter.clear();
        fundAdapter.addAll(productList);
        fundAdapter.notifyDataSetChanged();
    }

//    @Subscribe(threadMode = ThreadMode.MAIN)
//    public void process(ProductEvent event) {
//
//    }

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
}
