package com.taikor.investment.find;

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
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;

import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.GeneralAdapter;
import com.taikor.investment.adapter.SearchNewsAdapter;
import com.taikor.investment.adapter.SearchStockAdapter;
import com.taikor.investment.adapter.SearchThemeAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.Block;
import com.taikor.investment.bean.HotNews;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;
import com.taikor.investment.utils.ToastUtils;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 搜索
 * Created by Any on 2017/8/14.
 */

public class SearchActivity extends BaseActivity {

    @BindView(R.id.et_find)
    EditText etFind;
    @BindView(R.id.ib_clear)
    ImageButton ibClear;
    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.ll_input)
    LinearLayout llInput;
    @BindView(R.id.rb_all)
    RadioButton rbAll;
    @BindView(R.id.rb_theme)
    RadioButton rbTheme;
    @BindView(R.id.rb_stock)
    RadioButton rbStock;
    @BindView(R.id.rb_message)
    RadioButton rbMessage;
    @BindView(R.id.rlv_search_theme)
    RecyclerView rlvSearchTheme;
    @BindView(R.id.rlv_search_stock)
    RecyclerView rlvSearchStock;
    @BindView(R.id.rlv_search_news)
    RecyclerView rlvSearchNews;
    @BindView(R.id.ll_all)
    LinearLayout llAll;
    @BindView(R.id.rlv_other)
    RecyclerView rlvOther;
    @BindView(R.id.ll_other)
    LinearLayout llOther;
    @BindView(R.id.ll_label)
    LinearLayout llLabel;

    private int mPage = 1;
    private String token, searchText;
    private SearchNewsAdapter newsAdapter;
    private SearchThemeAdapter themeAdapter;
    private SearchStockAdapter stockAdapter;
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据

    @Override
    public int getLayoutResource() {
        return R.layout.activity_search;
    }

    @Override
    protected void initView() {
        token = SharedPreferenceUtils.getString(this, "token", "");

        etFind.setHint("关键字");
        etFind.addTextChangedListener(myWatcher);
        etFind.setOnKeyListener(onKeyListener);

        themeAdapter = new SearchThemeAdapter(this);
        rlvSearchTheme.setAdapter(themeAdapter);
        rlvSearchTheme.setLayoutManager(new LinearLayoutManager(this));
        rlvSearchTheme.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));

        stockAdapter = new SearchStockAdapter(this);
        rlvSearchStock.setAdapter(stockAdapter);
        rlvSearchStock.setLayoutManager(new LinearLayoutManager(this));
        rlvSearchStock.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));

        newsAdapter = new SearchNewsAdapter(this);
        rlvSearchNews.setAdapter(newsAdapter);
        rlvSearchNews.setLayoutManager(new LinearLayoutManager(this));
        rlvSearchNews.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));

        rlvOther.setLayoutManager(new LinearLayoutManager(this));
        rlvOther.addItemDecoration(new DividerItemDecoration(this, DividerItemDecoration.HORIZONTAL));
    }

    //获取全部数据
    public void getData() {
        getThemeData();
        getStockData();
        getNewsData();
        llAll.setVisibility(View.VISIBLE);
    }

    //主题
    public void getThemeData() {
        Type themeType = new TypeToken<List<Block>>() {
        }.getType();

        OkGo.<List<Block>>get(Constant.SEARCH_THEME)
                .tag(SearchActivity.this)
                .headers("Authorization", token)
                .params("searchText", searchText)
                .params("skip", REQUEST_COUNT * (mPage - 1))
                .params("count", REQUEST_COUNT)
//                .params("fromTime", 0)
//                .params("toTime", 0)
//                .params("industryIds", "")
//                .params("topicIds", "")
//                .params("minMarketValue", -1)
//                .params("maxMarketValue", -1)
                .execute(new JsonCallBack<List<Block>>(themeType) {
                    @Override
                    public void onSuccess(Response<List<Block>> response) {
                        List<Block> body = response.body();
                        themeAdapter.clear();
                        if (body.size() > 0) {
                            themeAdapter.addAll(body);
                        }
                    }
                });
    }

    //个股
    public void getStockData() {
        final Type stockType = new TypeToken<List<Stock>>() {
        }.getType();

        OkGo.<List<Stock>>get(Constant.SEARCH_STOCK)
                .tag(SearchActivity.this)
                .headers("Authorization", token)
                .params("searchText", searchText)
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
                        if (body.size() > 0) {
                            stockAdapter.addAll(body);
                        }
                    }
                });
    }

    //新闻
    public void getNewsData() {
        OkGo.<HotNews>get(Constant.SEARCH_NEWS)
                .tag(SearchActivity.this)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .params("searchText", searchText)
                .params("skip", REQUEST_COUNT * (mPage - 1))
                .params("count", REQUEST_COUNT)
//                .params("fromTime", 0)
//                .params("toTime", 0)
//                .params("keyword", "")
//                .params("industryIds", "")
//                .params("topicIds", "")
//                .params("minMarketValue", -1)
//                .params("maxMarketValue", -1)
                .execute(new JsonCallBack<HotNews>(HotNews.class) {
                    @Override
                    public void onSuccess(Response<HotNews> response) {
                        HotNews body = response.body();
                        ToastUtils.showShort(SearchActivity.this, "数量：" + body.getTotalCount());
                        newsAdapter.clear();
                        if (body.getItemList().size() > 0) {
                            newsAdapter.addAll(body.getItemList());
                        }
                    }
                });
    }

    @OnClick({R.id.iv_back, R.id.ib_clear, R.id.rb_all, R.id.rb_theme, R.id.rb_stock, R.id.rb_message})
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.ib_clear:
                etFind.setText("");
                ibClear.setVisibility(View.GONE);
                break;
            case R.id.iv_back:
                CommonUtils.hideSoftKeyboard(etFind);
                finish();
                break;
            case R.id.rb_all:
                if (themeAdapter.getDataList().size() > 0 || stockAdapter.getDataList().size() > 0 || newsAdapter.getDataList().size() > 0) {
                    llAll.setVisibility(View.VISIBLE);
                    llOther.setVisibility(View.GONE);
                    llLabel.setVisibility(View.GONE);
                }
                break;
            case R.id.rb_theme:
                if (themeAdapter.getDataList().size() > 0) {
                    rlvOther.setAdapter(themeAdapter);
                    llLabel.setVisibility(View.VISIBLE);
                    llOther.setVisibility(View.VISIBLE);
                }
                llAll.setVisibility(View.GONE);
                break;
            case R.id.rb_stock:
                if (stockAdapter.getDataList().size() > 0) {
                    rlvOther.setAdapter(stockAdapter);
                    llLabel.setVisibility(View.VISIBLE);
                    llOther.setVisibility(View.VISIBLE);
                }
                llAll.setVisibility(View.GONE);
                break;
            case R.id.rb_message:
                if (newsAdapter.getDataList().size() > 0) {
                    llOther.setVisibility(View.VISIBLE);
                    llLabel.setVisibility(View.GONE);
                }
                llAll.setVisibility(View.GONE);
                break;
        }
    }

    //监听文本的变化
    TextWatcher myWatcher = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {

        }

        @Override
        public void afterTextChanged(Editable s) {
            //显示清除图标
            ibClear.setVisibility(View.VISIBLE);
        }
    };

    //文字输入之后，右下角按钮：完成
    private View.OnKeyListener onKeyListener = new View.OnKeyListener() {

        @Override
        public boolean onKey(View v, int keyCode, KeyEvent event) {
            if (keyCode == KeyEvent.KEYCODE_ENTER && event.getAction() == KeyEvent.ACTION_DOWN) {
                //隐藏软键盘
                CommonUtils.hideSoftKeyboard(v);
                //显示结果列表
                String s = etFind.getText().toString();
                if (!TextUtils.isEmpty(s)) {
                    searchText = s;
                    getData();
                }
                return true;
            }
            return false;
        }
    };
}
