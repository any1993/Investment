package com.taikor.investment.optional;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.view.View;
import android.widget.TextView;

import com.github.jdsjlzx.ItemDecoration.DividerDecoration;
import com.github.jdsjlzx.interfaces.OnRefreshListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.FundAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Fund;
import com.taikor.investment.bean.Product;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;

/**
 * 基金
 * Created by Any on 2017/8/2.
 */

public class FundFragment extends BaseFragment {

    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.rlv_general)
    LRecyclerView rlvProduct;

    private String token;
    private FundAdapter fundAdapter;
    private FragmentActivity activity;
    private LRecyclerViewAdapter mAdapter;
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_fund;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        fundAdapter = new FundAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(fundAdapter);
        rlvProduct.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvProduct.addItemDecoration(divider);
        //设置线性布局
        rlvProduct.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvProduct.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvProduct.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        rlvProduct.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //下拉刷新监听
        rlvProduct.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                fundAdapter.clear();
                getFundData();
                mAdapter.notifyDataSetChanged();

            }
        });
        rlvProduct.refresh();
        rlvProduct.setLoadMoreEnabled(false);
    }

//    private void getData() {
//        List<Product> productList = new ArrayList<>();
//        productList.add(new Product("269465", "同庆1期", 0, 0));
//        productList.add(new Product("13608", "海通海汇星石1号", 0.80, 1.8048));
//        productList.add(new Product("251474", "星石优粤语10号2期", 0.04, 1.0387));
//        productList.add(new Product("254941", "证大量化1号", 0.01, 1.0080));
//        productList.add(new Product("247404", "证大创新1号", 0, 0));
//        productList.add(new Product("240932", "证大量化稳健8号", 0, 0));
//        productList.add(new Product("232015", "证大新视野", 0, 0));
//        productList.add(new Product("8477", "乐瑞强债1号", 0.90, 1.8968));
//        productList.add(new Product("31090", "乐瑞强债5号", 0.67, 1.6699));
//        productList.add(new Product("54480", "乐瑞强债10号", 0.31, 1.3063));
//        rlvProduct.refreshComplete(10);
//        fundAdapter.addAll(productList);
//    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        OkGo.getInstance().cancelTag(this);
    }

    public void getFundData() {
        Type type = new TypeToken<List<Fund>>() {
        }.getType();

        OkGo.<List<Fund>>get(Constant.OPTIONAL_FUND)
                .tag(FundFragment.this)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .execute(new JsonCallBack<List<Fund>>(type) {
                    @Override
                    public void onSuccess(Response<List<Fund>> response) {
                        List<Fund> fundList = response.body();
                        rlvProduct.refreshComplete(REQUEST_COUNT);
                        if(fundList!=null){
                            if (fundList.size() == 0) {
                                emptyView.setVisibility(View.VISIBLE);
                                return;
                            }

                            fundAdapter.addAll(fundList);
                        }
                    }
                });
    }
}
