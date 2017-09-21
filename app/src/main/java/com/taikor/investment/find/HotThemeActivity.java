package com.taikor.investment.find;

import android.support.v7.widget.LinearLayoutManager;
import android.view.View;
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
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.adapter.HotThemeAdapter;
import com.taikor.investment.base.BaseActivity;
import com.taikor.investment.bean.HotTheme;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 热门主题列表
 * Created by Any on 2017/8/2.
 */

public class HotThemeActivity extends BaseActivity {
    @BindView(R.id.tv_top_bar_left)
    TextView tvTopBarLeft;
    @BindView(R.id.tv_top_bar_middle)
    TextView tvTopBarMiddle;
    @BindView(R.id.rlv_general)
    LRecyclerView rlvThemeList;

    private String token;
    private HotThemeAdapter hotThemeAdapter;
    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了

    @Override
    public int getLayoutResource() {
        return R.layout.activity_event;
    }

    @Override
    protected void initView() {
        token = SharedPreferenceUtils.getString(this, "token", "");

        tvTopBarLeft.setBackgroundResource(R.drawable.backup);
        tvTopBarMiddle.setText("热门主题");
        tvTopBarMiddle.setCompoundDrawables(null, null, null, null);

        hotThemeAdapter = new HotThemeAdapter(this);
        mAdapter = new LRecyclerViewAdapter(hotThemeAdapter);
        rlvThemeList.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(this)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvThemeList.addItemDecoration(divider);
        //设置线性布局
        rlvThemeList.setLayoutManager(new LinearLayoutManager(this));
        //设置刷新的样式
        rlvThemeList.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvThemeList.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvThemeList.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvThemeList.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                hotThemeAdapter.clear();
                mAdapter.notifyDataSetChanged();
                mCurrentCount = 0;
                getData();
            }
        });

        rlvThemeList.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvThemeList.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvThemeList.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");

        rlvThemeList.refresh();
    }

    private void getData() {

        Type type = new TypeToken<List<HotTheme>>() {
        }.getType();

        OkGo.<List<HotTheme>>get(Constant.HOT_THEME)
                .tag(HotThemeActivity.this)
                .headers("Authorization", token)
                .params("count", REQUEST_COUNT)
                .execute(new JsonCallBack<List<HotTheme>>(type) {
                    @Override
                    public void onSuccess(Response<List<HotTheme>> response) {
                        List<HotTheme> body = response.body();
                        if (body!=null&&body.size()>0){
                            hotThemeAdapter.addAll(body);
                            rlvThemeList.refreshComplete(REQUEST_COUNT);
                        }
                    }
                });
    }

    @OnClick({R.id.tv_top_bar_left})
    public void onViewClicked(View view) {
        switch (view.getId()) {
            case R.id.tv_top_bar_left:
                finish();
                break;
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        OkGo.getInstance().cancelTag(this);
    }
}
