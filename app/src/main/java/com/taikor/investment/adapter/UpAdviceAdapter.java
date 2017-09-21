package com.taikor.investment.adapter;

import android.content.Context;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.SeeUpAdvice;
import com.taikor.investment.utils.CommonUtils;

import java.util.List;

/**
 * 看涨观点榜
 * Created by Any on 2017/8/17.
 */

public class UpAdviceAdapter extends ListBaseAdapter<SeeUpAdvice> {

    public UpAdviceAdapter(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_up_advice;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, int position) {
        List<SeeUpAdvice.ViewPoint> viewPoints = mDataList.get(position).getViewPoints();

        TextView name = holder.getView(R.id.tv_plate_name);
        name.setText(mDataList.get(position).getStockName());

        TextView num = holder.getView(R.id.tv_plate_num);
        num.setText(viewPoints.get(position).getPersonCount() + "人");

        TextView rate = holder.getView(R.id.tv_plate_rate);
        double pointScale = mDataList.get(position).getPointScale();
        rate.setText(CommonUtils.setDoubleTwo(pointScale * 100) + "%");

        TextView title = holder.getView(R.id.tv_plate_title);
        title.setText(viewPoints.get(position).getSummury());
    }
}
