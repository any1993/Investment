package com.taikor.investment.find;

import android.content.Intent;
import android.support.v7.widget.LinearLayoutManager;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.github.jdsjlzx.ItemDecoration.DividerDecoration;
import com.github.jdsjlzx.interfaces.OnItemClickListener;
import com.github.jdsjlzx.interfaces.OnLoadMoreListener;
import com.github.jdsjlzx.interfaces.OnRefreshListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.FundAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.Product;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 搜索
 * Created by Any on 2017/8/14.
 */

public class SearchActivity extends BaseActivity {

    @BindView(R.id.iv_back)
    ImageView ivBack;
    @BindView(R.id.et_find)
    EditText etFind;
    @BindView(R.id.ib_clear)
    ImageButton ibClear;
    @BindView(R.id.ll_input)
    LinearLayout llInput;
    @BindView(R.id.rlv_general)
    LRecyclerView rlvGeneral;
    @BindView(R.id.empty_view)
    TextView emptyView;

    private int mPage = 1;
    private String keyword;
    private FundAdapter fundAdapter;
    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 15;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了

    @Override
    public int getLayoutResource() {
        return R.layout.activity_search;
    }

    @Override
    protected void initView() {
        etFind.setHint("关键字");
        etFind.addTextChangedListener(myWatcher);
        etFind.setOnKeyListener(onKeyListener);
        
        fundAdapter=new FundAdapter(this);
        mAdapter=new LRecyclerViewAdapter(fundAdapter);
        rlvGeneral.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(this)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvGeneral.addItemDecoration(divider);
        //设置线性布局
        rlvGeneral.setLayoutManager(new LinearLayoutManager(this));
        //设置刷新的样式
        rlvGeneral.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvGeneral.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvGeneral.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvGeneral.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                fundAdapter.clear();
                mAdapter.notifyDataSetChanged();
                mCurrentCount = 0;
                mPage=1;
                getData();
            }
        });

        //加载更多监听
        rlvGeneral.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore() {
                if (mCurrentCount < TOTAL_COUNT) {
                    getData();
                } else {
                    rlvGeneral.setNoMore(true);
                }
            }
        });

        rlvGeneral.setHeaderViewColor(R.color.colorAccent, R.color.dark, R.color.bgFF);
        //设置底部加载颜色
        rlvGeneral.setFooterViewColor(R.color.colorAccent, R.color.dark, R.color.bgFF);
        //设置底部加载文字提示
        rlvGeneral.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");
    }

    @OnClick({R.id.iv_back, R.id.ib_clear})
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.ib_clear:
                etFind.setText("");
                break;
            case R.id.iv_back:
                CommonUtils.hideSoftKeyboard(etFind);
                finish();
                break;
        }
    }

    //获取数据
    public void getData() {
        Type type = new TypeToken<List<Product>>() {
        }.getType();

        OkGo.<List<Product>>get(Constant.PRODUCT)
                .tag(SearchActivity.this)
                .params("keyword",keyword)
                .params("type", "-1")
                .params("target", "-1")
                .params("category", "-1")
                .params("term","-1")
                .params("companyID", "")
                .params("managerID", "")
                .params("closedPeriod", "-1")
                .params("openFrequency", "-1")
                .params("style", "-1")
                .params("sortType", 3)
                .params("count", REQUEST_COUNT)
                .params("skip", String.valueOf(REQUEST_COUNT * (mPage - 1)))
                .execute(new JsonCallBack<List<Product>>(type) {
                    @Override
                    public void onSuccess(com.lzy.okgo.model.Response<List<Product>> response) {
                        if (response == null) return;
                        List<Product> productList = response.body();
                        rlvGeneral.refreshComplete(REQUEST_COUNT);

                        if(productList.size()==0 && mPage==1){
                            emptyView.setVisibility(View.VISIBLE);
                            return;
                        }
                        emptyView.setVisibility(View.GONE);
                        fundAdapter.addAll(productList);
                        mCurrentCount += productList.size();
                        mPage++;
                    }
                });
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
                //显示ListView列表
                String s = etFind.getText().toString();
                if (!TextUtils.isEmpty(s)) {
                    keyword = s;
                    rlvGeneral.refresh();
                }
                return true;
            }
            return false;
        }
    };
}
