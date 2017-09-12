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
import com.taikor.investment.R;
import com.taikor.investment.adapter.FundAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Product;

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

    private FundAdapter fundAdapter;
    private FragmentActivity activity;
    private LRecyclerViewAdapter mAdapter;

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_fund;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();

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
                getData();
                mAdapter.notifyDataSetChanged();

            }
        });
        rlvProduct.refresh();
        rlvProduct.setLoadMoreEnabled(false);
    }

    private void getData() {
        List<Product> productList = new ArrayList<>();

        productList.add(new Product("269465", "同庆1期", 0, 0));
        productList.add(new Product("13608", "海通海汇星石1号", 0, 0));
        productList.add(new Product("251474", "星石优粤语10号2期", 0, 0));
        productList.add(new Product("254941", "证大量化1号", 0, 0));
        productList.add(new Product("247404", "证大创新1号", 0, 0));
        productList.add(new Product("240932", "证大量化稳健8号", 0, 0));
        productList.add(new Product("232015", "证大新视野", 0, 0));
        productList.add(new Product("8477", "乐瑞强债1号", 0.90, 1.8968));
        productList.add(new Product("31090", "乐瑞强债5号", 0.67, 1.6699));
        productList.add(new Product("54480", "乐瑞强债10号", 0.31, 1.3063));

        rlvProduct.refreshComplete(10);
        fundAdapter.addAll(productList);
    }

}
