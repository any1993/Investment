package com.taikor.investment.news;

import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;

import com.github.jdsjlzx.interfaces.OnItemClickListener;
import com.github.jdsjlzx.interfaces.OnLoadMoreListener;
import com.github.jdsjlzx.interfaces.OnRefreshListener;
import com.github.jdsjlzx.recyclerview.LRecyclerView;
import com.github.jdsjlzx.recyclerview.LRecyclerViewAdapter;
import com.github.jdsjlzx.recyclerview.ProgressStyle;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.callback.StringCallback;
import com.lzy.okgo.model.Response;
import com.taikor.investment.R;
import com.taikor.investment.adapter.PushAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.General;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import butterknife.BindView;

/**
 * 资讯——推送
 * Created by Any on 2017/8/9.
 */

public class PushFragment extends BaseFragment {

    @BindView(R.id.rlv_push)
    RecyclerView rlvGeneral;

    private String token;
    private FragmentActivity activity;
    private PushAdapter pushAdapter;

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_push;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {

        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");

        //推荐新闻
        pushAdapter = new PushAdapter(activity);
        rlvGeneral.setAdapter(pushAdapter);
        rlvGeneral.setLayoutManager(new LinearLayoutManager(activity));
    }

    @Override
    public void initData() {
        super.initData();
        getNewsData();
    }

    //获取新闻数据
    private void getNewsData() {
        long second = System.currentTimeMillis();
        OkGo.<String>get(Constant.PUSH_NEWS)
                .tag(PushFragment.this)
                .headers("Authorization", token)
                .params("userID", Constant.USER_ID)
                .params("startTime", 1502301600)//10*24*60*60=864000
                .params("endTime", second)
                .params("type", 15)
                .execute(new StringCallback() {
                    @Override
                    public void onSuccess(Response<String> response) {
                        String body = response.body();
                        if (body != null)
                            parseData(body);
                    }
                });
    }

    private void parseData(String body) {
        Type type = new TypeToken<Map<String, List<General>>>() {
        }.getType();

        Gson gson = new Gson();
        Map<String, List<General>> map = null;
        try {
            map = gson.fromJson(body, type);
        } catch (Exception e) {
            e.printStackTrace();
        }
        pushAdapter.setData(map);
    }
}
