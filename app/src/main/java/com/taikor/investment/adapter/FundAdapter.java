package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.Fund;
import com.taikor.investment.bean.Product;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.CommonUtils;

/**
 * 自选基金
 * Created by Any on 2017/9/6.
 */

public class FundAdapter extends ListBaseAdapter<Fund> {

    public FundAdapter(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_theme;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        //名称
        TextView name = holder.getView(R.id.tv_theme_name);
        name.setText(mDataList.get(position).getFundName());

        TextView rateView = holder.getView(R.id.tv_theme_percent);
        TextView netFit = holder.getView(R.id.tv_theme_price);

        double rate = mDataList.get(position).getProfitRate();
        if (rate > 0) {
            rateView.setTextColor(ContextCompat.getColor(mContext, R.color.up));
        } else if (rate < 0) {
            rateView.setTextColor(ContextCompat.getColor(mContext, R.color.down));
        }
        rateView.setText(CommonUtils.setDoubleTwo(rate));
        netFit.setText(CommonUtils.setDoubleFour(mDataList.get(position).getUnitNet()));

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getFundID());
                intent.putExtra("fromPage", "fund");
                mContext.startActivity(intent);
            }
        });
    }
}
