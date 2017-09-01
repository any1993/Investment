package com.taikor.investment.optional;

import android.content.Intent;
import android.support.v7.widget.LinearLayoutManager;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.github.jdsjlzx.ItemDecoration.DividerDecoration;
import com.github.jdsjlzx.interfaces.OnLoadMoreListener;
import com.github.jdsjlzx.interfaces.OnRefreshListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.R;
import com.taikor.investment.adapter.ProductAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.Product;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 搜索产品，从列表中选择产品
 * Created by Any on 2017/4/13.
 */

public class ProductActivity extends BaseActivity{

    @BindView(R.id.tv_top_bar_left)
    TextView tvBack;//上一步
    @BindView(R.id.tv_top_bar_middle)
    TextView tvMiddleTitle;//标题
    @BindView(R.id.tv_top_bar_right2)
    public TextView tvRight;//完成
    @BindView(R.id.et_find)
    EditText etFind;//搜索
    @BindView(R.id.ib_clear)
    ImageButton ibClear;//清除
    @BindView(R.id.ll_product)
    LinearLayout llProduct;//产品布局
    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.rlv_product)
    LRecyclerView rlvProduct;

    private int mPage = 1;
    private String keyword = "";
    private ProductAdapter productAdapter = null;
    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了

    @Override
    public int getLayoutResource() {
        return R.layout.activity_product;
    }

    @Override
    public void initView() {
        //初始化界面
        tvBack.setText("上一步");
        tvBack.setBackground(null);
        tvMiddleTitle.setText("添加产品");
        tvMiddleTitle.setCompoundDrawables(null, null, null, null);
        tvRight.setText("完成");
        tvRight.setBackground(null);
        tvRight.setVisibility(View.VISIBLE);

        //设置文字的监听
        etFind.setHint("关键字");
        etFind.addTextChangedListener(watcher);
        etFind.setOnKeyListener(onKeyListener);

        productAdapter = new ProductAdapter(this);
        mAdapter = new LRecyclerViewAdapter(productAdapter);
        rlvProduct.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(this)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvProduct.addItemDecoration(divider);
        //设置线性布局
        rlvProduct.setLayoutManager(new LinearLayoutManager(this));
        //设置刷新的样式
        rlvProduct.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvProduct.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvProduct.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvProduct.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                productAdapter.clear();
                mAdapter.notifyDataSetChanged();
                mCurrentCount = 0;
                mPage=1;
                getData();
            }
        });

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

        rlvProduct.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvProduct.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvProduct.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");
    }

    @OnClick({R.id.tv_top_bar_left, R.id.tv_top_bar_right2, R.id.ib_clear})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                finish();
                break;
            case R.id.tv_top_bar_right2://返回到添加产品，设置仓位
                //获取选中的产品集合
                ArrayList<Product> selectedItem = productAdapter.getSelectedItem();
                if (selectedItem.size() != 0) {
                    tvRight.setText("完成(" + selectedItem.size() + ")");
                    Intent intent = this.getIntent();
                    intent.putExtra("products_list", selectedItem);
                    setResult(RESULT_OK, intent);
                    this.finish();//此处一定要调用finish()方法
                }
                break;
            case R.id.ib_clear:
                etFind.setText("");
                ibClear.setVisibility(View.GONE);
                break;
        }
    }

    public void getData(){
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
                        if (response == null) return;
                        List<Product> productList = response.body();
                        rlvProduct.refreshComplete(REQUEST_COUNT);

                        if(productList.size()==0){
                            emptyView.setVisibility(View.VISIBLE);
                            return;
                        }
                        productAdapter.addAll(productList);
                        mCurrentCount += productList.size();
                        mPage++;
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
                    llProduct.setVisibility(View.VISIBLE);
                }
                return true;
            }
            return false;
        }
    };

    @Override
    protected void onDestroy() {
        super.onDestroy();
        OkGo.getInstance().cancelTag(this);
    }
}
