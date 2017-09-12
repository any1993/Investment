package com.taikor.investment.find;

import android.graphics.Color;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.callback.StringCallback;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.base.BaseFragment;
import com.taikor.investment.bean.Asset;
import com.taikor.investment.bean.Emotion;
import com.taikor.investment.bean.Stock;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import butterknife.BindView;

/**
 * 上证指数
 * Created by Any on 2017/8/29.
 */

public class IndexChuangFragment extends BaseFragment {

    @BindView(R.id.tv_stock_chuang)
    TextView tvStockType;
    @BindView(R.id.tv_chuang_price)
    TextView tvStockSettlement;
    @BindView(R.id.tv_chuang)
    TextView tvUpDown;
    @BindView(R.id.tv_chuang_asset)
    TextView tvAsset;
    @BindView(R.id.chuang_chart)
    LineChart lineChart;

    private String token;
    private FragmentActivity activity;
    private List<String> dateList = new ArrayList<>();
    private Map<Integer, Float> priceMap = new HashMap<>();
    private List<Float> priceList = new ArrayList<>(), emotionList = new ArrayList<>();

    @Override
    public int getLayoutResource() {
        return R.layout.fragment_chuang;
    }

    @Override
    protected void initView(View view, Bundle savedInstanceState) {
        activity = getActivity();
        token = SharedPreferenceUtils.getString(activity, "token", "");
    }

    @Override
    public void initData() {
        super.initData();
        getOpenDay();
        getAssetData();
    }

    //获取交易日
    private void getOpenDay() {
        OkGo.<String>get(Constant.OPEN_DAY)
                .tag(activity)
                .headers("Authorization", token)
                .params("endTime", System.currentTimeMillis())
                .params("sortType", 1)
                .params("count", 5)
                .execute(new StringCallback() {
                    @Override
                    public void onSuccess(Response<String> response) {

                        if (response.body() == null) return;
                        Type type = new TypeToken<List<String>>() {
                        }.getType();
                        Gson gson = new Gson();
                        String body = response.body();
                        List<String> date = null;
                        try {
                            date = gson.fromJson(body, type);
                            Collections.reverse(date);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }

                        getStockPrice(date);
                    }
                });
    }

    //获取大盘价格
    public void getStockPrice(final List<String> date) {

        Type type = new TypeToken<List<Stock>>() {
        }.getType();
        //获取大盘价格
        OkGo.<List<Stock>>get(Constant.STOCK_PRICE)
                .tag(activity)
                .headers("Authorization", token)
                .params("type", 0)
                .params("stockId", "sz399006")
                .params("fromTime", 0)
                .params("endTime", 0)
                .params("count", 5)
                .execute(new JsonCallBack<List<Stock>>(type) {
                    @Override
                    public void onSuccess(Response<List<Stock>> response) {
                        if (response.body() == null) return;
                        List<Stock> stockList = response.body();
                        if (stockList.size() == 0) return;

                        //设置界面数据
                        int lastDay = stockList.size() - 1;
                        String name = stockList.get(lastDay).getName();
                        if (!TextUtils.isEmpty(name)) tvStockType.setText(name);

                        double percent = stockList.get(lastDay).getChangepercent();

                        if (percent > 0) {
                            tvUpDown.setTextColor(ContextCompat.getColor(activity, R.color.up));
                            tvStockSettlement.setTextColor(ContextCompat.getColor(activity, R.color.up));
                            tvUpDown.setText("+" + CommonUtils.setDoubleTwo(percent) + "%");
                        } else if (percent < 0) {
                            tvUpDown.setTextColor(ContextCompat.getColor(activity, R.color.down));
                            tvStockSettlement.setTextColor(ContextCompat.getColor(activity, R.color.down));
                            tvUpDown.setText("-" + CommonUtils.setDoubleTwo(percent) + "%");
                        } else {
                            tvUpDown.setTextColor(ContextCompat.getColor(activity, R.color.text_color_3));
                            tvStockSettlement.setTextColor(ContextCompat.getColor(activity, R.color.text_color_3));
                            tvUpDown.setText("0.00%");
                        }

                        tvStockSettlement.setText((CommonUtils.setDoubleTwo(stockList.get(lastDay).getSettlement())));

                        dateList.clear();
                        priceList.clear();
                        //获取符合交易日的大盘价格
                        for (int i = 0; i < date.size(); i++) {
                            dateList.add(date.get(i).substring(6,10));
                            String openDay = date.get(i).substring(0, 10);
                            for (int j = 0; j < stockList.size(); j++) {
                                String tickTime = stockList.get(j).getTicktime().substring(0, 10);
                                if (tickTime.equals(openDay)) {
                                    priceMap.put(i, CommonUtils.getDoubleTwo(stockList.get(j).getTrade()));
                                    priceList.add(CommonUtils.getDoubleTwo(stockList.get(j).getTrade()));
                                }
                            }
                        }
                        getEmotionIndex();
                    }
                });
    }

    //获取情绪指数
    private void getEmotionIndex() {
        Type type = new TypeToken<List<Emotion>>() {
        }.getType();
        OkGo.<List<Emotion>>get(Constant.STOCK_CHUANG)
                .tag(activity)
                .headers("Authorization", token)
                .params("type", 0)
                .params("count", 5)
                .params("rate", 0)
                .params("datetime", 0)
                .execute(new JsonCallBack<List<Emotion>>(type) {
                    @Override
                    public void onSuccess(Response<List<Emotion>> response) {
                        if (response.body() == null) return;
                        List<Emotion> stockList = response.body();
                        if (stockList.size() == 0) return;
                        emotionList.clear();
                        for (int i = 0; i < stockList.size(); i++) {
                            emotionList.add(CommonUtils.getDoubleTwo(stockList.get(i).getEmotion()));
                        }
                        //设置图标数据
                        initChartData();
                    }
                });
    }

    //填充图表
    private void initChartData() {

        lineChart.setTouchEnabled(false);//是否可以触摸
        lineChart.setDragEnabled(false);//是否可以拖动
        lineChart.setScaleEnabled(false);// 是否可以缩放
        lineChart.getDescription().setEnabled(false);// 是否显示数据描述
        lineChart.setBackgroundColor(Color.WHITE);
        lineChart.setDrawGridBackground(true);//是否绘制网格背景
        lineChart.setGridBackgroundColor(Color.WHITE);//设置网格背景颜色
        lineChart.setDrawBorders(true);// 是否绘制边线
        lineChart.setBorderColor(R.color.text_color_9);//边线颜色
        lineChart.setBorderWidth(0.5f);//边线宽度，单位dp

        XAxis xAxis = lineChart.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextSize(10f);
        xAxis.setTextColor(R.color.text_color_9);
        xAxis.setDrawGridLines(false);
        xAxis.setDrawAxisLine(true);
        xAxis.setLabelCount(5, true);

        xAxis.setValueFormatter(new IAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, AxisBase axis) {
                return dateList.get((int) value % dateList.size());
            }
        });

        if (priceList.size() == 0 || emotionList.size() == 0) return;

        YAxis rightAxis = lineChart.getAxisRight();
        rightAxis.setTextColor(R.color.text_color_9);
        rightAxis.setAxisMaximum(Collections.max(priceList) + 5);
        rightAxis.setAxisMinimum(Collections.min(priceList) - 5);
        rightAxis.setTextSize(10f);
        rightAxis.setDrawGridLines(false);
        rightAxis.setLabelCount(5, true);
        rightAxis.setGranularityEnabled(true);

        YAxis leftAxis = lineChart.getAxisLeft();
        leftAxis.setTextColor(R.color.text_color_9);
        leftAxis.setAxisMaximum(Collections.max(emotionList) + 5);
        leftAxis.setAxisMinimum(0);
        leftAxis.setTextSize(10f);
        leftAxis.setDrawGridLines(false);
        leftAxis.setLabelCount(5, true);
        leftAxis.setDrawZeroLine(false);
        leftAxis.setGranularityEnabled(false);

        ArrayList<Entry> priceValue = new ArrayList<>();
        Integer[] keys = priceMap.keySet().toArray(new Integer[0]);
        Arrays.sort(keys);
        for (int i = 0; i < keys.length; i++) {//0,1,2,4
            priceValue.add(new Entry(keys[i], priceMap.get(keys[i])));
        }

        ArrayList<Entry> emotionValue = new ArrayList<>();
        for (int i = 0; i < emotionList.size(); i++) {
            emotionValue.add(new Entry(i, emotionList.get(i)));
        }

        LineDataSet set1, set2;
        if (lineChart.getData() != null &&
                lineChart.getData().getDataSetCount() > 0) {
            set1 = (LineDataSet) lineChart.getData().getDataSetByIndex(0);
            set2 = (LineDataSet) lineChart.getData().getDataSetByIndex(1);
            set1.setValues(priceValue);
            set2.setValues(emotionValue);
            lineChart.getData().notifyDataChanged();
            lineChart.notifyDataSetChanged();
        } else {
            set1 = new LineDataSet(priceValue, "大盘指数");
            set1.setAxisDependency(YAxis.AxisDependency.RIGHT);
            set1.setColor(Color.parseColor("#3095FF"));
            set1.setCircleColor(Color.parseColor("#3095FF"));
            set1.setCircleRadius(2f);
            set1.setDrawCircles(true);//是否显示圆点
            set1.setDrawCircleHole(false);
            set1.setLineWidth(1f);//线的宽度
            set1.setDrawValues(false);//是否显示数值
            set1.setDrawFilled(false);//是否填充
            set1.setDrawCircleHole(false);

            set2 = new LineDataSet(emotionValue, "市场情绪");
            set2.setAxisDependency(YAxis.AxisDependency.LEFT);
            set2.setDrawCircles(false);
            set2.setColor(Color.parseColor("#FF634E"));
            set2.setLineWidth(1f);
            set2.setDrawFilled(true);
            set2.setFillAlpha(68);
            set2.setDrawValues(false);
            set2.setFillColor(Color.RED);
            set2.setDrawCircleHole(false);

            LineData data = new LineData(set1, set2);
            lineChart.setData(data);
            lineChart.invalidate();
        }
    }

    //获取主力资金流
    private void getAssetData() {
        Type type = new TypeToken<List<Asset>>() {
        }.getType();
        OkGo.<List<Asset>>get(Constant.ASSET_CHUANG)
                .tag(activity)
                .headers("Authorization", token)
                .params("type", 0)
                .params("skipHour", 1)
                .params("fromTime", System.currentTimeMillis() / 1000 - 3 * 24 * 60 * 60)
                .params("endTime", System.currentTimeMillis() / 1000)
                .params("onlyMainForce", false)
                .execute(new JsonCallBack<List<Asset>>(type) {
                    @Override
                    public void onSuccess(Response<List<Asset>> response) {
                        List<Asset> body = response.body();
                        if (body.size() == 0) return;
                        int last = body.size() - 1;//440271.9
                        double mainForce = body.get(last).getMainForce();

                        if (mainForce > 0) {
                            tvAsset.setTextColor(ContextCompat.getColor(activity, R.color.up));
                            tvAsset.setText("创业板指 流入 " + CommonUtils.setDoubleTwo(mainForce / 10000) + "亿");
                        } else if (mainForce < 0) {
                            tvAsset.setTextColor(ContextCompat.getColor(activity, R.color.down));
                            String s = CommonUtils.setDoubleTwo(mainForce / 10000);
                            tvAsset.setText("创业板指  流出  " + s.substring(1, s.length()) + "亿");
                        }
                    }
                });

    }
}
