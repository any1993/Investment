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
import com.taikor.investment.adapter.GroupAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Group;
import com.taikor.investment.event.BooleanEvent;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.Constant;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.lang.reflect.Type;
import java.util.List;

import butterknife.BindView;

/**
 * 组合
 * Created by Any on 2017/8/2.
 */

public class GroupFragment extends BaseFragment {

    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.rlv_general)
    LRecyclerView rlvGroup;

    private GroupAdapter groupAdapter;
    private FragmentActivity activity;
    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 10;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_group;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();

        groupAdapter = new GroupAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(groupAdapter);
        rlvGroup.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvGroup.addItemDecoration(divider);
        //设置线性布局
        rlvGroup.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvGroup.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvGroup.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        rlvGroup.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);

        //下拉刷新监听
        rlvGroup.setOnRefreshListener(new OnRefreshListener() {
            @Override
            public void onRefresh() {
                groupAdapter.clear();
                getData();
                mAdapter.notifyDataSetChanged();
                mCurrentCount = 0;
            }
        });

        rlvGroup.setLoadMoreEnabled(false);

        rlvGroup.refresh();
    }

    private void getData() {
        Type type = new TypeToken<List<Group>>() {
        }.getType();

        OkGo.<List<Group>>get(Constant.GROUP)
                .tag(activity)
                .params("userid","20000")
                .params("type", "-1")
                .params("style", "-1")
                .params("proportion", "-1")
                .params("count", "30")
                .params("sortType", "3")
                .execute(new JsonCallBack<List<Group>>(type) {
                    @Override
                    public void onSuccess(Response<List<Group>> response) {
                        if (response.body() == null) return;
                        List<Group> groupList = response.body();

                        rlvGroup.refreshComplete(REQUEST_COUNT);

                        if (groupList.size() == 0) {
                            emptyView.setVisibility(View.VISIBLE);
                            return;
                        }
                        groupAdapter.addAll(groupList);
                        mCurrentCount += groupList.size();

                    }
                });
    }

    //刷新数据
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void process(BooleanEvent event) {
        String type = event.getType();
        if (event.isFlag()) {
            if (type.equals("group"))
                rlvGroup.refresh();
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
}
