package com.taikor.investment.optional;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.view.View;
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
import com.lzy.okgo.model.Response;
import com.taikor.investment.R;
import com.taikor.investment.adapter.StockAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;
import com.taikor.investment.utils.ToastUtils;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;

/**
 * 个股
 * Created by Any on 2017/8/2.
 */

public class StockFragment extends BaseFragment {

    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.rlv_general)
    LRecyclerView rlvStock;

    private String token;
    private StockAdapter stockAdapter;
    private FragmentActivity activity;
    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_stock;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        stockAdapter = new StockAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(stockAdapter);
        rlvStock.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvStock.addItemDecoration(divider);
        //设置线性布局
        rlvStock.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvStock.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvStock.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvStock.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvStock.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                stockAdapter.clear();
                mAdapter.notifyDataSetChanged();
                mCurrentCount = 0;
                getData();
            }
        });

        //加载更多监听
        rlvStock.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore() {
                if (mCurrentCount < TOTAL_COUNT) {
                    getData();
                } else {
                    rlvStock.setNoMore(true);
                }
            }
        });

        rlvStock.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvStock.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvStock.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");

        rlvStock.refresh();

        //点击
        mAdapter.setOnItemClickListener(new OnItemClickListener() {
            @Override
            public void onItemClick(View view, int position) {
                if (stockAdapter.getDataList().size() > position) {
                    Stock stock = stockAdapter.getDataList().get(position);
                    Intent intent = new Intent(activity, GeneralDescActivity.class);
                    intent.putExtra("itemId", stock.getSymbol());
                    intent.putExtra("fromPage","stock");
                    startActivity(intent);
                }
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        OkGo.getInstance().cancelTag(this);
    }

    private void getData() {
        Type type = new TypeToken<List<Stock>>() {
        }.getType();

        OkGo.<List<Stock>>get(Constant.USER_STOCK)
                .tag(StockFragment.this)
                .headers("Authorization", token)
                .params("userID",Constant.USER_ID)//br_1838525384
                .execute(new JsonCallBack<List<Stock>>(type) {
                    @Override
                    public void onSuccess(Response<List<Stock>> response) {
                        if (response == null) return;
                        List<Stock> stockList = response.body();
                        rlvStock.refreshComplete(REQUEST_COUNT);

                        if(stockList.size()==0){
                            emptyView.setVisibility(View.VISIBLE);
                            return;
                        }
                        stockAdapter.addAll(stockList);
                        mCurrentCount += stockList.size();

                    }
                });
    }
}
