package com.taikor.investment.find;

import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.ContextCompat;
import android.support.v7.widget.LinearLayoutManager;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.RadioButton;
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
import com.taikor.investment.R;
import com.taikor.investment.adapter.FixedVolatilityAdapter;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Product;
import com.taikor.investment.event.ProductEvent;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.OnClick;

/**
 * 净值波动型
 * Created by Any on 2017/4/5.
 */
public class NetVolatilityFragment extends BaseFragment implements View.OnClickListener
        , CompoundButton.OnCheckedChangeListener {

    @BindView(R.id.rb_invest)
    RadioButton rbInvest;//投资标的
    @BindView(R.id.rb_type)
    RadioButton rbType;//银行理财
    @BindView(R.id.rb_date)
    RadioButton rbDate;//产品期限
    @BindView(R.id.rb_choose)
    RadioButton rbChoose;//筛选
    @BindView(R.id.empty_view)
    TextView emptyView;
    @BindView(R.id.rlv_general)
    LRecyclerView rlvFundAll;

    private int mPage = 1, location;
    private int width, height;
    private boolean flag = true;
    private FragmentActivity activity;
    private FixedVolatilityAdapter fundAdapter;
    private ImageView ivSwitchButton;
    private RadioButton rbNoInvest, rbNoType, rbNoChoose;
    private PopupWindow investWindow, typeWindow, timeWindow, chooseWindow;
    private List<CheckBox> investCb = new ArrayList<>(), typeCb = new ArrayList<>(), styleCb = new ArrayList<>();
    private List<RadioButton> dateRb = new ArrayList<>(), closeRb = new ArrayList<>(), openRb = new ArrayList<>();
    private String target = "-1", category = "-1", term = "-1", closedPeriod = "-1", openFrequency = "-1", style = "-1";
    private String[] value_invest = {"1", "2", "3", "4", "5", "6"}, value_type = {"2", "3", "4"}, date_value = {"-1", "1", "2", "3", "4", "5", "6"},
            close_value = {"-1", "1", "2", "3", "4"}, open_value = {"-1", "1", "2", "3"}, style_value = {"1", "2", "3", "4"};

    private LRecyclerViewAdapter mAdapter;
    private static final int TOTAL_COUNT = 1000;//服务器端一共多少条数据
    private static final int REQUEST_COUNT = 15;//每一页展示多少条数据
    private static int mCurrentCount = 0;//已经获取到多少条数据了

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_fund_all;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        width = CommonUtils.getScreenWidth();
        height = CommonUtils.getScreenHeight();

        //初始化popupWindow
        initInvestPopupWindow();
        initTimePopWindow();
        initChoosePopWindow();
        initTypePopWindow();

        fundAdapter = new FixedVolatilityAdapter(activity);
        mAdapter = new LRecyclerViewAdapter(fundAdapter);
        rlvFundAll.setAdapter(mAdapter);

        //设置分割线
        DividerDecoration divider = new DividerDecoration.Builder(activity)
                .setHeight(R.dimen.divider_height)
                .setPadding(R.dimen.divider_padding)
                .setColorResource(R.color.divider_color)
                .build();
        rlvFundAll.addItemDecoration(divider);
        //设置线性布局
        rlvFundAll.setLayoutManager(new LinearLayoutManager(activity));
        //设置刷新的样式
        rlvFundAll.setRefreshProgressStyle(ProgressStyle.LineSpinFadeLoader);
        //刷新箭头
        rlvFundAll.setArrowImageView(R.drawable.ic_pulltorefresh_arrow);
        //加载更多的样式
        rlvFundAll.setLoadingMoreProgressStyle(ProgressStyle.BallSpinFadeLoader);

        //下拉刷新监听
        rlvFundAll.setOnRefreshListener(new OnRefreshListener() {
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
        rlvFundAll.setOnLoadMoreListener(new OnLoadMoreListener() {
            @Override
            public void onLoadMore() {
                if (mCurrentCount < TOTAL_COUNT) {
                    getData();
                } else {
                    rlvFundAll.setNoMore(true);
                }
            }
        });

        rlvFundAll.setHeaderViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载颜色
        rlvFundAll.setFooterViewColor(R.color.colorAccent, R.color.dark, android.R.color.white);
        //设置底部加载文字提示
        rlvFundAll.setFooterViewHint("拼命加载中", "已经全部为你呈现了", "网络不给力啊，点击再试一次吧");

        rlvFundAll.refresh();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        OkGo.getInstance().cancelTag(this);
    }

    public void getData() {
        Type type = new TypeToken<List<Product>>() {
        }.getType();

        OkGo.<List<Product>>get(Constant.PRODUCT)
                .tag(this)
                .params("keyword", "")
                .params("type", "2")
                .params("target", target)
                .params("category", category)
                .params("term", term)
                .params("companyID", "")
                .params("managerID", "")
                .params("closedPeriod", closedPeriod)
                .params("openFrequency", openFrequency)
                .params("style", style)
                .params("sortType", "1")
                .params("count", REQUEST_COUNT)
                .params("skip", String.valueOf(REQUEST_COUNT * (mPage - 1)))
                .execute(new JsonCallBack<List<Product>>(type) {
                    @Override
                    public void onSuccess(com.lzy.okgo.model.Response<List<Product>> response) {
                        if (response == null) return;
                        List<Product> productList = response.body();
                        rlvFundAll.refreshComplete(REQUEST_COUNT);

                        if (productList.size() == 0) {
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

    @OnClick({R.id.rb_invest, R.id.rb_type, R.id.rb_date, R.id.rb_choose})
    public void click(View view) {
        switch (view.getId()) {
            case R.id.rb_invest://股票投资
                investWindow.showAsDropDown(rbInvest);
                location = 1;
                break;
            case R.id.rb_type://银行理财
                typeWindow.showAsDropDown(rbType);
                location = 2;
                break;
            case R.id.rb_date://产品期限
                timeWindow.showAsDropDown(rbDate);
                location = 3;
                break;
            case R.id.rb_choose://筛选
                chooseWindow.showAsDropDown(rbChoose);
                location = 4;
                break;
        }
    }

    //设置透明度
    private void setAlpha(float alpha) {
        Window window = getActivity().getWindow();
        WindowManager.LayoutParams params = window.getAttributes();
        params.alpha = alpha;
        window.setAttributes(params);
    }

    /**
     * 添加新笔记时弹出的popWin关闭的事件，主要是为了将背景透明度改回来
     */
    private class DismissListener implements PopupWindow.OnDismissListener {
        @Override
        public void onDismiss() {
            setAlpha(1f);
        }
    }

    // 用于筛选时刷新数据
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEvent(ProductEvent event) {
        rlvFundAll.refresh();
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EventBus.getDefault().register(this);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.view_grey://改变背景透明度
                changeBackground();
                break;
            case R.id.tv_sure://确定
                sure();
                break;
            case R.id.tv_reset://重置
                reset();
                break;
            case R.id.iv_switch:
                if (flag) {
                    ivSwitchButton.setImageResource(R.drawable.switch_off);
                    flag = false;
                } else {
                    ivSwitchButton.setImageResource(R.drawable.switch_on);
                    flag = true;
                }
                break;
        }
    }

    private void changeBackground() {
        switch (location) {
            case 1:
                changeView(investWindow, rbInvest);
                break;
            case 2:
                changeView(typeWindow, rbType);
                break;
            case 3:
                changeView(timeWindow, rbDate);
                break;
        }
    }

    private void reset() {
        switch (location) {
            case 1:
                resetButton(investCb, rbNoInvest);
                break;
            case 2:
                resetButton(typeCb, rbNoType);
                break;
            case 3:
                resetRadioButton(dateRb);
                break;
            case 4:
                resetRadioButton(closeRb);
                resetRadioButton(openRb);
                resetButton(styleCb, rbNoChoose);
                if (!flag) {
                    ivSwitchButton.setImageResource(R.drawable.switch_on);
                }
                break;
        }
    }

    private void sure() {
        switch (location) {
            case 1:
                changeView(investWindow, rbInvest);
                byInvestTarget();
                break;
            case 2:
                changeView(typeWindow, rbType);
                byProductType();
                break;
            case 3:
                changeView(timeWindow, rbDate);
                //传递选中的RadioButton对应的内容
                for (int i = 0; i < dateRb.size(); i++) {
                    if (dateRb.get(i).isChecked()) {
                        term = date_value[i];
                    }
                }
                EventBus.getDefault().post(new ProductEvent());
                break;
            case 4:
                changeView(chooseWindow, rbChoose);
                byOtherOption();
                break;
        }
    }

    //投资标的确定按钮
    private void byInvestTarget() {
        if (rbNoInvest.isChecked())
            target = "-1";
        else {
            StringBuilder sb_invest = new StringBuilder();
            for (int i = 0; i < investCb.size(); i++) {
                if (investCb.get(i).isChecked()) {
                    if (sb_invest.length() == 0) {
                        sb_invest.append(value_invest[i]);
                    } else {
                        sb_invest.append(",").append(value_invest[i]);
                    }
                }
            }
            target = sb_invest.toString();
        }
        //传递选中的checkbox对应的内容
        EventBus.getDefault().post(new ProductEvent());
    }

    //产品类型确定按钮
    private void byProductType() {
        if (rbNoType.isChecked())
            category = "-1";
        else {
            StringBuilder sb_type = new StringBuilder();
            for (int i = 0; i < typeCb.size(); i++) {
                if (typeCb.get(i).isChecked()) {
                    if (sb_type.length() == 0)
                        sb_type.append(value_type[i]);
                    else
                        sb_type.append(",").append(value_type[i]);
                }
            }
            category = sb_type.toString();
        }
        //传递选中的checkbox对应的内容
        EventBus.getDefault().post(new ProductEvent());
    }

    //筛选的确定按钮
    private void byOtherOption() {
        for (int i = 0; i < closeRb.size(); i++) {
            if (closeRb.get(i).isChecked()) {
                closedPeriod = close_value[i];
            }
        }
        for (int i = 0; i < openRb.size(); i++) {
            if (openRb.get(i).isChecked()) {
                openFrequency = open_value[i];
            }
        }
        if (rbNoChoose.isChecked()) {
            style = "-1";
        } else {
            StringBuilder sb_style = new StringBuilder();
            for (int i = 0; i < styleCb.size(); i++) {
                if (styleCb.get(i).isChecked()) {
                    if (sb_style.length() == 0)
                        sb_style.append(style_value[i]);
                    else
                        sb_style.append(",").append(style_value[i]);
                }
            }
            style = sb_style.toString();
        }
        //传递选中的checkbox对应的内容.RadioButton对应的内容，开关状态
        EventBus.getDefault().post(new ProductEvent());
    }

    //radioButton,checkBox混合，重置按钮
    private void resetButton(List<CheckBox> checkboxList, RadioButton radio) {
        radio.setChecked(true);
        for (int i = 0; i < checkboxList.size(); i++) {
            if (checkboxList.get(i).isChecked()) {
                checkboxList.get(i).setChecked(false);
            }
        }
    }

    //RadioButton重置
    public void resetRadioButton(List<RadioButton> radioButtons) {
        if (!radioButtons.get(0).isChecked()) {
            radioButtons.get(0).setChecked(true);
        }
    }

    //修改界面
    public void changeView(final PopupWindow popupWindow, final RadioButton radioButton) {
        popupWindow.dismiss();
        if (radioButton.isChecked()) {
            radioButton.setChecked(false);
        }
    }

    //选中checkbox的时候，设置radioButton为false
    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        if (isChecked) {
            switch (buttonView.getId()) {
                case R.id.cb_stock:
                    if (rbNoInvest.isChecked())
                        rbNoInvest.setChecked(false);
                    break;
                case R.id.cb_bond:
                    if (rbNoInvest.isChecked())
                        rbNoInvest.setChecked(false);
                    break;
                case R.id.cb_futures:
                    if (rbNoInvest.isChecked())
                        rbNoInvest.setChecked(false);
                    break;
                case R.id.cb_blend:
                    if (rbNoInvest.isChecked())
                        rbNoInvest.setChecked(false);
                    break;
                case R.id.cb_overseas:
                    if (rbNoInvest.isChecked())
                        rbNoInvest.setChecked(false);
                    break;
                case R.id.cb_others:
                    if (rbNoInvest.isChecked())
                        rbNoInvest.setChecked(false);
                    break;
                case R.id.rb_no_invest2:
                    resetButton(investCb, rbNoInvest);
                    break;
                case R.id.cb_fund:
                    if (rbNoType.isChecked())
                        rbNoType.setChecked(false);
                    break;
                case R.id.cb_manage:
                    if (rbNoType.isChecked())
                        rbNoType.setChecked(false);
                    break;
                case R.id.cb_hook:
                    if (rbNoType.isChecked())
                        rbNoType.setChecked(false);
                    break;
                case R.id.rb_no_type2:
                    resetButton(typeCb, rbNoType);
                    break;
                case R.id.cb_theme:
                    if (rbNoChoose.isChecked())
                        rbNoChoose.setChecked(false);
                    break;
                case R.id.cb_value:
                    if (rbNoChoose.isChecked())
                        rbNoChoose.setChecked(false);
                    break;
                case R.id.cb_trend:
                    if (rbNoChoose.isChecked())
                        rbNoChoose.setChecked(false);
                    break;
                case R.id.cb_interest:
                    if (rbNoChoose.isChecked())
                        rbNoChoose.setChecked(false);
                    break;
                case R.id.rb_no_choose:
                    resetButton(styleCb, rbNoChoose);
                    break;
            }
        }

    }

    //投资标的弹出框
    public void initInvestPopupWindow() {
        //创建popupWindow对象
        final View investPop = getActivity().getLayoutInflater().inflate(R.layout.ppw_invest2, null);
        //初始化popupWindow对象
        investWindow = new PopupWindow(investPop, width, height - CommonUtils.dip2px(135), true);
        //点击其他位置，popupWindow消失
        investWindow.setTouchable(true);
        investWindow.setOutsideTouchable(true);
        investWindow.setBackgroundDrawable(ContextCompat.getDrawable(getActivity(), android.R.color.transparent));
        investWindow.setOnDismissListener(new DismissListener());
        //初始化popupWindow的布局中的其他控件
        CheckBox cbStock = (CheckBox) investPop.findViewById(R.id.cb_stock);
        CheckBox cbBond = (CheckBox) investPop.findViewById(R.id.cb_bond);
        CheckBox cbFutures = (CheckBox) investPop.findViewById(R.id.cb_futures);
        CheckBox cbBlend = (CheckBox) investPop.findViewById(R.id.cb_blend);
        CheckBox cbOverseas = (CheckBox) investPop.findViewById(R.id.cb_overseas);
        CheckBox cbOthers = (CheckBox) investPop.findViewById(R.id.cb_others);
        rbNoInvest = (RadioButton) investPop.findViewById(R.id.rb_no_invest2);
        View view = investPop.findViewById(R.id.view_grey);
        cbStock.setOnCheckedChangeListener(this);
        cbBond.setOnCheckedChangeListener(this);
        cbFutures.setOnCheckedChangeListener(this);
        cbBlend.setOnCheckedChangeListener(this);
        cbOverseas.setOnCheckedChangeListener(this);
        cbOthers.setOnCheckedChangeListener(this);
        rbNoInvest.setOnCheckedChangeListener(this);
        rbNoInvest.setChecked(true);
        investCb.add(cbStock);
        investCb.add(cbBond);
        investCb.add(cbFutures);
        investCb.add(cbBlend);
        investCb.add(cbOthers);
        investCb.add(cbOverseas);
        view.setOnClickListener(this);//灰色部分
        TextView tvReset = (TextView) investPop.findViewById(R.id.tv_reset);
        TextView tvSure = (TextView) investPop.findViewById(R.id.tv_sure);
        tvSure.setOnClickListener(this); //确定
        tvReset.setOnClickListener(this);   //重置
    }

    //产品分类的弹出框
    public void initTypePopWindow() {
        //创建popupWindow对象
        View typePop = getActivity().getLayoutInflater().inflate(R.layout.ppw_type2, null);
        //初始化popupWindow对象
        typeWindow = new PopupWindow(typePop, width, height - CommonUtils.dip2px(135), true);
        //点击其他位置，popupWindow消失
        typeWindow.setTouchable(true);
        typeWindow.setOutsideTouchable(true);
        typeWindow.setBackgroundDrawable(ContextCompat.getDrawable(getActivity(), android.R.color.transparent));
        //初始化popupWindow的布局中的其他控件
        CheckBox cbFund = (CheckBox) typePop.findViewById(R.id.cb_fund);
        CheckBox cbManage = (CheckBox) typePop.findViewById(R.id.cb_manage);
        CheckBox cbHook = (CheckBox) typePop.findViewById(R.id.cb_hook);
        rbNoType = (RadioButton) typePop.findViewById(R.id.rb_no_type2);
        View view = typePop.findViewById(R.id.view_grey);
        cbFund.setOnCheckedChangeListener(this);
        cbManage.setOnCheckedChangeListener(this);
        cbHook.setOnCheckedChangeListener(this);
        rbNoType.setOnCheckedChangeListener(this);
        rbNoType.setChecked(true);
        typeCb.add(cbFund);
        typeCb.add(cbManage);
        typeCb.add(cbHook);
        view.setOnClickListener(this);//灰色部分
        TextView tvReset = (TextView) typePop.findViewById(R.id.tv_reset);
        TextView tvSure = (TextView) typePop.findViewById(R.id.tv_sure);
        tvSure.setOnClickListener(this); //确定
        tvReset.setOnClickListener(this);   //重置
    }

    // 产品期限的弹出框
    public void initTimePopWindow() {
        //创建popupWindow对象
        View datePop = getActivity().getLayoutInflater().inflate(R.layout.ppw_date, null);
        //初始化popupWindow对象
        timeWindow = new PopupWindow(datePop, width, height - CommonUtils.dip2px(135), true);
        //点击其他位置，popupWindow消失
        timeWindow.setTouchable(true);
        timeWindow.setOutsideTouchable(true);
        timeWindow.setBackgroundDrawable(ContextCompat.getDrawable(getActivity(), android.R.color.transparent));
        //初始化popupWindow的布局中的其他控件
        RadioButton rbOneDay = (RadioButton) datePop.findViewById(R.id.rb_one_day);
        RadioButton rbOneWeek = (RadioButton) datePop.findViewById(R.id.rb_one_week);
        RadioButton rbOneMonth = (RadioButton) datePop.findViewById(R.id.rb_one_month);
        RadioButton rbThreeMonth = (RadioButton) datePop.findViewById(R.id.rb_three_month);
        RadioButton rbHalfYear = (RadioButton) datePop.findViewById(R.id.rb_half_year);
        RadioButton rbOneYear = (RadioButton) datePop.findViewById(R.id.rb_one_year);
        RadioButton rbNoLimit = (RadioButton) datePop.findViewById(R.id.rb_no_date);
        View view = datePop.findViewById(R.id.view_grey);
        rbNoLimit.setChecked(true);
        dateRb.add(rbNoLimit);
        dateRb.add(rbOneDay);
        dateRb.add(rbOneWeek);
        dateRb.add(rbOneMonth);
        dateRb.add(rbThreeMonth);
        dateRb.add(rbHalfYear);
        dateRb.add(rbOneYear);
        view.setOnClickListener(this);//灰色部分
        TextView tvReset = (TextView) datePop.findViewById(R.id.tv_reset);
        TextView tvSure = (TextView) datePop.findViewById(R.id.tv_sure);
        tvSure.setOnClickListener(this); //确定
        tvReset.setOnClickListener(this);   //重置
    }

    //筛选的弹出框
    public void initChoosePopWindow() {
        //创建popupWindow对象
        View choosePop = getActivity().getLayoutInflater().inflate(R.layout.ppw_choose, null);
        //初始化popupWindow对象
        chooseWindow = new PopupWindow(choosePop, WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.WRAP_CONTENT, true);
        //点击其他位置，popupWindow消失
        chooseWindow.setTouchable(true);
        chooseWindow.setOutsideTouchable(true);
        chooseWindow.setBackgroundDrawable(ContextCompat.getDrawable(getActivity(), android.R.color.transparent));
        //初始化popupWindow的布局中的其他控件
        RadioButton rbLessOneMonth = (RadioButton) choosePop.findViewById(R.id.rb_less_one_month);
        RadioButton rbMoreThreeMonth = (RadioButton) choosePop.findViewById(R.id.rb_more_three_month);
        RadioButton rbMoreHalfYear = (RadioButton) choosePop.findViewById(R.id.rb_more_half_year);
        RadioButton rbNoLimit = (RadioButton) choosePop.findViewById(R.id.rb_no_close);
        rbNoLimit.setChecked(true);
        closeRb.add(rbNoLimit);
        closeRb.add(rbLessOneMonth);
        closeRb.add(rbMoreThreeMonth);
        closeRb.add(rbMoreHalfYear);
        RadioButton rbDay = (RadioButton) choosePop.findViewById(R.id.rb_day);
        RadioButton rbMonth = (RadioButton) choosePop.findViewById(R.id.rb_month);
        RadioButton rbThree = (RadioButton) choosePop.findViewById(R.id.rb_three);
        RadioButton rbNoLimit2 = (RadioButton) choosePop.findViewById(R.id.rb_no_open);
        rbNoLimit2.setChecked(true);
        openRb.add(rbNoLimit2);
        openRb.add(rbDay);
        openRb.add(rbMonth);
        openRb.add(rbThree);
        CheckBox cbTheme = (CheckBox) choosePop.findViewById(R.id.cb_theme);
        CheckBox cbValue = (CheckBox) choosePop.findViewById(R.id.cb_value);
        CheckBox cbTrend = (CheckBox) choosePop.findViewById(R.id.cb_trend);
        CheckBox cbInterest = (CheckBox) choosePop.findViewById(R.id.cb_interest);
        rbNoChoose = (RadioButton) choosePop.findViewById(R.id.rb_no_choose);
        cbTheme.setOnCheckedChangeListener(this);
        cbValue.setOnCheckedChangeListener(this);
        cbTrend.setOnCheckedChangeListener(this);
        cbInterest.setOnCheckedChangeListener(this);
        rbNoChoose.setOnCheckedChangeListener(this);
        rbNoChoose.setChecked(true);
        styleCb.add(cbTheme);
        styleCb.add(cbValue);
        styleCb.add(cbTrend);
        styleCb.add(cbInterest);
        ivSwitchButton = (ImageView) choosePop.findViewById(R.id.iv_switch);
        TextView tvReset = (TextView) choosePop.findViewById(R.id.tv_reset);
        TextView tvSure = (TextView) choosePop.findViewById(R.id.tv_sure);
        tvSure.setOnClickListener(this); //确定
        tvReset.setOnClickListener(this);   //重置
        ivSwitchButton.setOnClickListener(this);//开关
    }

}
