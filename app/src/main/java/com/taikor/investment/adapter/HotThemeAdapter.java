package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.github.mikephil.charting.charts.CombinedChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.MarkerImage;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.data.CombinedData;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;
import com.google.gson.reflect.TypeToken;
import com.lzy.okgo.OkGo;
import com.lzy.okgo.model.Response;
import com.taikor.investment.JsonCallBack;
import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Block;
import com.taikor.investment.bean.HotTheme;
import com.taikor.investment.bean.HotIndex;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.SharedPreferenceUtils;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * 热点主题
 * Created by Any on 2017/7/28.
 */

public class HotThemeAdapter extends ListBaseAdapter<HotTheme> {

//    private String token;
//    private CombinedChart chartView;
//    private List<String> dateList = new ArrayList<>(), themeList = new ArrayList<>();
//    private List<Integer> hotList = new ArrayList<>();

    public HotThemeAdapter(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_hot_theme;
    }

//    public void setDate(List<String> dateList, String token) {
//        this.dateList = dateList;
//        this.token = token;
//    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        TextView themeName = holder.getView(R.id.tv_hot_theme_name);
        TextView themeTrade = holder.getView(R.id.tv_hot_theme_trade);
        TextView themeChange = holder.getView(R.id.tv_hot_theme_change);
        TextView themeTitle = holder.getView(R.id.tv_hot_theme_title);
        TextView stockName = holder.getView(R.id.tv_hot_theme_stock);
        TextView stockChange = holder.getView(R.id.tv_hot_theme_percent);
        ImageView flag = holder.getView(R.id.iv_theme_flag);

        themeName.setText(mDataList.get(position).getTopicName());
        double topicChange = mDataList.get(position).getTopicChange();

        //主题
        if (topicChange > 0) {
            themeChange.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            themeTrade.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            themeChange.setText("+"+CommonUtils.setDoubleTwo(topicChange) + "%");
        } else if (topicChange < 0) {
            themeChange.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            themeTrade.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            themeChange.setText("-"+CommonUtils.setDoubleTwo(topicChange) + "%");
        }else{
            themeChange.setText("0.00%");
        }

        themeTrade.setText(CommonUtils.setDoubleTwo(mDataList.get(position).getTopicTrade()));

        themeTitle.setText(mDataList.get(position).getArticleTitle());

        double stockChange1 = mDataList.get(position).getStockChange();
        //股票
        if (stockChange1 > 0) {
            stockChange.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            stockName.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            flag.setImageResource(R.drawable.theme_up);

            stockChange.setText("+"+CommonUtils.setDoubleTwo(stockChange1) + "%");
        } else if (stockChange1 < 0) {
            stockChange.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            stockName.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            flag.setImageResource(R.drawable.theme_down);

            stockChange.setText("-"+CommonUtils.setDoubleTwo(stockChange1) + "%");
        }else{
            stockChange.setText("0.00%");
        }

        stockName.setText(mDataList.get(position).getStockName());

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getTopicID());
                intent.putExtra("fromPage", "theme");
                mContext.startActivity(intent);
            }
        });

//        chartView = holder.getView(R.id.combine_view);
//        getThemePrice(position);
    }
/*
    private void getThemePrice(int position) {
        Type type = new TypeToken<List<Block>>() {
        }.getType();

        final String topicID = mDataList.get(position).getTopicID();

        OkGo.<List<Block>>get(Constant.THEME_PRICE)
                .headers("Authorization", token)
                .params("type", 0)
                .params("blockId", topicID)
                .params("fromTime", 0)
                .params("endTime", 0)
                .params("count", 5)
                .execute(new JsonCallBack<List<Block>>(type) {
                    @Override
                    public void onSuccess(Response<List<Block>> response) {
                        if (response == null) return;
                        List<Block> blockList = response.body();
                        if (blockList.size() == 0) return;
                        for (int i = 0; i < blockList.size(); i++) {
                            String tickTime = blockList.get(i).getFetchTime().substring(6, 10);
                            for (int j = 0; j < dateList.size(); j++) {
                                if (tickTime.equals(dateList.get(j))) {
                                    themeList.add(CommonUtils.setDoubleTwo(blockList.get(i).getAvgPrice()));
                                }
                            }
                        }
                        getHotIndex(topicID);
                    }
                });


    }

    public void getHotIndex(String topicID) {
        OkGo.<HotIndex>get(Constant.HOT_INDEX)
                .headers("Authorization", token)
                .params("topicID", topicID)
                .execute(new JsonCallBack<HotIndex>(HotIndex.class) {
                    @Override
                    public void onSuccess(Response<HotIndex> response) {
                        if (response == null) return;
                        HotIndex body = response.body();
                        List<Integer> historyHot = body.getHistoryHot();
                        for (int i = (historyHot.size() - 5); i < historyHot.size(); i++) {
                            hotList.add(historyHot.get(i));
                        }
                        setData();
                    }
                });
    }

    private void setData() {
        chartView.setTouchEnabled(false);//是否可以触摸
        chartView.setDragEnabled(false);//是否可以拖动
        chartView.setScaleEnabled(false);// 是否可以缩放
        chartView.setDrawGridBackground(true);//是否绘制网格背景
        chartView.setGridBackgroundColor(Color.WHITE);//设置网格背景颜色
        chartView.getDescription().setEnabled(false);
        chartView.setDrawBorders(true);// 是否绘制边线
        chartView.setBorderColor(R.color.text_color_9);//边线颜色
        chartView.setBorderWidth(0.5f);//边线宽度，单位dp
        chartView.setBackgroundColor(Color.WHITE);
        chartView.setDrawGridBackground(false);

        XAxis xAxis = chartView.getXAxis();
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);
        xAxis.setTextSize(9f);
        xAxis.setLabelCount(5, true);
        xAxis.setTextColor(R.color.text_color_9);
        xAxis.setDrawGridLines(false);
        xAxis.setDrawAxisLine(true);

        xAxis.setValueFormatter(new IAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, AxisBase axis) {
                if (dateList == null) return "";
                if (dateList.size() == 0) return "";
//                Log.d("TAG", "size: " + dateList.size());
//                Log.d("TAG", "value: " + value);
                if ((int) value > 0 && (int) value < dateList.size())
                    return dateList.get((int) value % dateList.size());
                else
                    return "";
            }
        });
        if (themeList.size() == 0 || hotList.size() == 0) return;
        String minPrice = Collections.min(themeList);
        int maxEmotion = Collections.max(hotList);

        Log.d("TAG", "minPrice: " + minPrice);
        Log.d("TAG", "maxEmotion: " + maxEmotion);

        float maxTheme = (int) (Float.valueOf(minPrice) / 100) * 100 + 100;
        float maxHot = maxEmotion / 10 * 10 + 10;

        YAxis leftAxis = chartView.getAxisLeft();
        leftAxis.setTextColor(R.color.text_color_9);
        leftAxis.setAxisMaximum(maxHot);
        leftAxis.setAxisMinimum(0f);
        leftAxis.setDrawGridLines(false);
        leftAxis.setLabelCount(5, true);
        leftAxis.setGranularityEnabled(true);
        leftAxis.setGranularity(1f);

        YAxis rightAxis = chartView.getAxisRight();
        rightAxis.setTextColor(R.color.text_color_9);
        rightAxis.setAxisMaximum(maxTheme);
        rightAxis.setAxisMinimum(0f);
        rightAxis.setLabelCount(5, true);
        rightAxis.setDrawGridLines(false);
        rightAxis.setGranularityEnabled(true);
        rightAxis.setGranularity(1f);

        CombinedData data = new CombinedData();
        data.setData(generateLine());
        data.setData(generateBar());
        chartView.setData(data);
        chartView.invalidate();
    }

    private BarData generateBar() {
        if (hotList.size() == 0) return null;

        ArrayList<BarEntry> entries1 = new ArrayList<>();
        for (int index = 0; index < hotList.size(); index++) {
            entries1.add(new BarEntry(index, Float.valueOf(hotList.get(index))));
        }

        BarDataSet set1 = new BarDataSet(entries1, "热度指数");
        set1.setColor(Color.parseColor("#F58B8B"));
        set1.setValueTextColor(Color.rgb(60, 220, 78));
        set1.setValueTextSize(10f);
        set1.setAxisDependency(YAxis.AxisDependency.LEFT);
        set1.setDrawValues(false);
        float barWidth = 0.45f;

        BarData d = new BarData(set1);
        d.setBarWidth(barWidth);

        return d;
    }

    private LineData generateLine() {
        if (themeList.size() == 0) return null;

        LineData d = new LineData();
        ArrayList<Entry> entries = new ArrayList<>();
        for (int index = 0; index < themeList.size(); index++)
            entries.add(new Entry(index + (dateList.size() - themeList.size()), Float.valueOf(themeList.get(index))));

        LineDataSet set = new LineDataSet(entries, "主题价格");
        set.setColor(Color.parseColor("#FFBB70"));
        set.setLineWidth(2.5f);
        set.setCircleRadius(5f);
        set.setMode(LineDataSet.Mode.LINEAR);
        set.setDrawValues(false);
        set.setValueTextSize(10f);
        set.setDrawCircles(false);
        set.setValueTextColor(R.color.text_color_9);
        set.setAxisDependency(YAxis.AxisDependency.RIGHT);
        d.addDataSet(set);

        return d;
    }
    */
}
