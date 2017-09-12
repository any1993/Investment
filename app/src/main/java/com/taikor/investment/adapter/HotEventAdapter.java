package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.HotEvent;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;

/**
 * 热门事件
 * Created by Any on 2017/7/28.
 */

public class HotEventAdapter extends ListBaseAdapter<HotEvent> {

    private Map<String, String> map = new HashMap();

    public HotEventAdapter(Context context) {
        super(context);
        map.put("0", "重大合同,80.65%");
        map.put("1", "股东增减持,68.33%");
        map.put("2", "资产注入,68.57%");
        map.put("3", "股权置换,63.64%");
        map.put("4", "融资、融券,80.30%");
        map.put("5", "分红,88.71%");
        map.put("6", "高送转,88.00%");
        map.put("7", "高管变动,89.71%");
        map.put("8", "股权激励,84.63%");
        map.put("9", "盈利预测,80.30%");

    }

    @Override
    public int getLayoutId() {
        return R.layout.item_hot_event;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        TextView type = holder.getView(R.id.tv_event_type);
        TextView rate = holder.getView(R.id.tv_event_rate);
        TextView name = holder.getView(R.id.tv_event_stock);
        TextView changePercent = holder.getView(R.id.tv_event_change);
        TextView eventTitle = holder.getView(R.id.tv_event_title);

        final String eventID = mDataList.get(position).getEventID();
        String stockName = mDataList.get(position).getStockName();
        double stockChange = mDataList.get(position).getStockChange();
        String title = mDataList.get(position).getTitle();

        String firstLetter = eventID.substring(0, 1);
        String value = getValue(firstLetter);
        String[] split = value.split(",");

        type.setText(split[0]);
        rate.setText(split[1]);

        if (stockChange > 0) {
            changePercent.setTextColor(ContextCompat.getColor(mContext, R.color.up));
            changePercent.setText("+" + CommonUtils.setDoubleTwo(stockChange) + "%");
        } else if (stockChange < 0) {
            changePercent.setTextColor(ContextCompat.getColor(mContext, R.color.down));
            changePercent.setText("-" + CommonUtils.setDoubleTwo(stockChange) + "%");
        } else {
            changePercent.setText("0.00%");
        }

        if (TextUtils.isEmpty(stockName)) {
            name.setText("");
            changePercent.setText("");
        } else {
            name.setText(stockName);
        }

        eventTitle.setText(title);

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", eventID);
                intent.putExtra("fromPage", "event");
                mContext.startActivity(intent);
            }
        });
    }

    private String getValue(String letter) {
        String[] keys = map.keySet().toArray(new String[0]);
        for (int i = 0; i < keys.length; i++) {
            if (letter.equals(keys[i]))
                return map.get(keys[i]);
        }

        return map.get("0");
    }
}
