package com.taikor.investment.optional;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.widget.DividerItemDecoration;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;

import com.github.jdsjlzx.ItemDecoration.DividerDecoration;
import com.github.jdsjlzx.interfaces.OnLoadMoreListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.ProductAdapter;
import com.taikor.investment.adapter.SearchStockAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.Product;
import com.taikor.investment.bean.SearchStock;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.event.AllDataEvent;
import com.taikor.investment.event.SearchEvent;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 搜索产品，从列表中选择产品
 * Created by Any on 2017/4/13.
 */

public class ProductActivity extends BaseActivity {

    @BindView(R.id.tv_top_bar_left)
    TextView tvBack;//上一步
    @BindView(R.id.tv_top_bar_middle)
    TextView tvMiddleTitle;//标题
    @BindView(R.id.tv_top_bar_right2)
    TextView tvRight;//完成
    @BindView(R.id.et_find)
    EditText etFind;
    @BindView(R.id.ib_clear)
    ImageButton ibClear;
    @BindView(R.id.rlv_search_stocks)
    RecyclerView rlvSearchStocks;
    @BindView(R.id.rlv_search_fund)
    RecyclerView rlvSearchFund;
    @BindView(R.id.ll_search_all)
    LinearLayout llSearchAll;
    @BindView(R.id.rlv_stock)
    RecyclerView rlvStock;
    @BindView(R.id.ll_search_stock)
    LinearLayout llSearchStock;
    @BindView(R.id.rlv_product)
    LRecyclerView rlvProduct;
    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.ll_search_fund)
    LinearLayout llSearchFund;
    @BindView(R.id.rb_search_all)
    RadioButton rbSearchAll;
    @BindView(R.id.rb_search_fund)
    RadioButton rbSearchFund;
    @BindView(R.id.rb_search_stock)
    RadioButton rbSearchStock;

    private int mPage = 1;
    private boolean share, flag = false;
    private String token, keyword, portfolioName, description, investmentAmount;
    private SearchStockAdapter stockAdapter;
    private ProductAdapter productAdapter;
    private LRecyclerViewAdapter mAdapter;
    private ArrayList<Stock> stocks = new ArrayList<>();
    private ArrayList<Product> funds = new ArrayList<>();
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据

    @Override
    public int getLayoutResource() {
        return R.layout.activity_product;
    }

    @Override
    public void initView() {
        token = SharedPreferenceUtils.getString(this, "token", "");
        //设置文字的监听
        etFind.setHint("关键字");
        etFind.addTextChangedListener(watcher);
        etFind.setOnKeyListener(onKeyListener);

        //初始化界面
        tvBack.setText("上一步");
        tvBack.setBackground(null);
        tvMiddleTitle.setText("添加产品");
        tvMiddleTitle.setCompoundDrawables(null, null, null, null);
        tvRight.setText("确定");
        tvRight.setBackground(null);
        tvRight.setVisibility(View.VISIBLE);

        //全部
        stockAdapter = new SearchStockAdapter(this);
        stockAdapter.setShow(true);
        rlvSearchStocks.setAdapter(stockAdapter);
        rlvSearchStocks.setLayoutManager(new LinearLayoutManager(this));
        rlvSearchStocks.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));

        rlvStock.setAdapter(stockAdapter);
        rlvStock.setLayoutManager(new LinearLayoutManager(this));
        rlvStock.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));

        productAdapter = new ProductAdapter(this);
        rlvSearchFund.setAdapter(productAdapter);
        rlvSearchFund.setLayoutManager(new LinearLayoutManager(this));
        rlvSearchFund.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));
        //分割线
        DividerDecoration divider = new DividerDecoration.Builder(this)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();

        //基金
        mAdapter = new LRecyclerViewAdapter(productAdapter);
        rlvProduct.setAdapter(mAdapter);
        rlvProduct.addItemDecoration(divider);
        rlvProduct.setLayoutManager(new LinearLayoutManager(this));
        rlvProduct.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);
        rlvProduct.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        rlvProduct.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");
        rlvProduct.setPullRefreshEnabled(false);
        //加载更多监听
        rlvProduct.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore() {
                if (mCurrentCount < TOTAL_COUNT) {
                    getData();
                } else {
                    rlvProduct.setNoMore(true);
                }
            }
        });
    }

    //请求全部数据
    public void getData() {
        getStockData();
        getFundData();
        llSearchAll.setVisibility(View.VISIBLE);
    }

    //获取股票数据
    public void getStockData() {
        final Type stockType = new TypeToken<List<Stock>>() {
        }.getType();

        OkGo.<List<Stock>>get(Constant.SEARCH_STOCK)
                .tag(ProductActivity.this)
                .headers("Authorization", token)
                .params("searchText", keyword)
                .params("skip", REQUEST_COUNT * (mPage - 1))
                .params("count", REQUEST_COUNT)
//                .params("fromTime", 0)
//                .params("toTime", 0)
//                .params("industryIds", "")
//                .params("topicIds", "")
//                .params("minMarketValue", -1)
//                .params("maxMarketValue", -1)
                .execute(new JsonCallBack<List<Stock>>(stockType) {
                    @Override
                    public void onSuccess(Response<List<Stock>> response) {
                        List<Stock> body = response.body();
                        stockAdapter.clear();
                        if (body.size() == 0) {
                            if (rbSearchStock.isChecked()) {
                                emptyView.setVisibility(View.VISIBLE);
                            }
                        } else {
                            stockAdapter.addAll(body);
                        }
                    }
                });
    }

    //获取基金数据
    public void getFundData() {
        Type type = new TypeToken<List<Product>>() {
        }.getType();

        OkGo.<List<Product>>get(Constant.PRODUCT)
                .tag(ProductActivity.this)
                .params("keyword", keyword)
                .params("type", "-1")
                .params("target", "-1")
                .params("category", "-1")
                .params("term", "-1")
                .params("companyID", "")
                .params("managerID", "")
                .params("closedPeriod", "-1")
                .params("openFrequency", "-1")
                .params("style", "-1")
                .params("sortType", "3")
                .params("count", REQUEST_COUNT)
                .params("skip", String.valueOf(REQUEST_COUNT * (mPage - 1)))
                .execute(new JsonCallBack<List<Product>>(type) {
                    @Override
                    public void onSuccess(Response<List<Product>> response) {
                        rlvProduct.refreshComplete(REQUEST_COUNT);
                        List<Product> productList = response.body();
                        if (productList == null) return;
                        productAdapter.clear();
                        if (productList.size() == 0) {
                            if (rbSearchFund.isChecked()) {
                                emptyView.setVisibility(View.VISIBLE);
                            }
                        } else {
                            if (rbSearchAll.isChecked()) {
                                List<Product> list = new ArrayList<>();
                                for (int i = 0; i < 5; i++) {
                                    list.add(productList.get(i));
                                }
                                productAdapter.addAll(list);
                            } else if (rbSearchFund.isChecked()) {
                                productAdapter.addAll(productList);
                                mCurrentCount += productList.size();
                                mPage++;
                            }
                        }
                    }
                });
    }

    //文字监听
    private TextWatcher watcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            ibClear.setVisibility(View.VISIBLE);
        }
    };

    //文字输入之后，右下角键盘变成完成
    private View.OnKeyListener onKeyListener = new View.OnKeyListener() {

        @Override
        public boolean onKey(View v, int keyCode, KeyEvent event) {
            if (keyCode == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_DOWN) {
                CommonUtils.hideSoftKeyboard(v);
                //显示ListView列表
                String s = etFind.getText().toString();
                if (!TextUtils.isEmpty(s)) {
                    keyword = s;
                    getData();
                }
                return true;
            }
            return false;
        }
    };

    @OnClick({R.id.tv_top_bar_left, R.id.tv_top_bar_right2, R.id.ib_clear, R.id.rb_search_all, R.id.rb_search_stock, R.id.rb_search_fund})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left://返回
//                finish();
                transmitData(false);
                break;
            case R.id.tv_top_bar_right2://确定
                transmitData(true);
//                Intent searchIntent = new Intent(ProductActivity.this, SetRepoActivity.class);
//                AllDataEvent event = new AllDataEvent();
//                ArrayList<Stock> selectedStock = stockAdapter.getSelectedItem();
//                ArrayList<Product> selectedFund = productAdapter.getSelectedItem();
//                if (stocks != null && stocks.size() > 0) {
//                    for (int i = 0; i < stocks.size(); i++) {
//                        selectedStock.add(selectedStock.size(), stocks.get(i));
//                    }
//                }
//                event.setStocks(selectedStock);
//                if (funds != null && funds.size() > 0) {
//                    for (int i = 0; i < funds.size(); i++) {
//                        selectedFund.add(selectedFund.size(), funds.get(i));
//                    }
//                }
//                event.setProducts(selectedFund);
//
//                if (!flag) {
//                    event.setPortfolioName(portfolioName);
//                    event.setDescription(description);
//                    event.setInvestmentAmount(investmentAmount);
//                    event.setShare(share);
//                    EventBus.getDefault().postSticky(event);
//                    startActivity(searchIntent);
//                } else {
//                    event.setFlag(true);
//                    EventBus.getDefault().postSticky(event);
//                }
//                finish();
                break;
            case R.id.ib_clear:
                etFind.setText("");
                ibClear.setVisibility(View.GONE);
                break;
            case R.id.rb_search_all:
                if (stockAdapter.getDataList().size() > 0 || productAdapter.getDataList().size() > 0) {
                    llSearchAll.setVisibility(View.VISIBLE);
                    llSearchFund.setVisibility(View.GONE);
                    llSearchStock.setVisibility(View.GONE);
                }
                break;
            case R.id.rb_search_stock:
                if (stockAdapter.getDataList().size() > 0) {
                    llSearchStock.setVisibility(View.VISIBLE);
                }
                llSearchAll.setVisibility(View.GONE);
                llSearchFund.setVisibility(View.GONE);
                break;
            case R.id.rb_search_fund:
                if (productAdapter.getDataList().size() > 0) {
                    llSearchFund.setVisibility(View.VISIBLE);
                }
                llSearchStock.setVisibility(View.GONE);
                llSearchAll.setVisibility(View.GONE);
                break;
        }
    }

    public void transmitData(boolean flag) {
        SearchEvent event = new SearchEvent();
        ArrayList<Stock> selectedStock = stockAdapter.getSelectedItem();
        ArrayList<Product> selectedFund = productAdapter.getSelectedItem();
        if(flag){
            if(selectedStock.size()==0&&selectedFund.size()==0){
                return;
            }
        }

        event.setStocks(selectedStock);
        event.setProducts(selectedFund);
        EventBus.getDefault().postSticky(event);
        finish();
    }

//    @Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
//    public void getData(AllDataEvent event) {
//        flag = event.isFlag();
//        portfolioName = event.getPortfolioName();
//        description = event.getDescription();
//        share = event.isShare();
//        investmentAmount = event.getInvestmentAmount();
//        stocks = event.getStocks();
//        funds = event.getProducts();
//    }
//
//    //注册事件总线
//    @Override
//    public void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        EventBus.getDefault().register(this);
//    }
//
//    //解除事件总线
//    @Override
//    public void onDestroy() {
//        super.onDestroy();
//        EventBus.getDefault().unregister(this);
//    }
}
