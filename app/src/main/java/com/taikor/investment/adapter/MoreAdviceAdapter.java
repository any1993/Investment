package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.view.View;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.MarketAdvice;
import com.taikor.investment.find.MarketActivity;
import com.taikor.investment.find.MarketDescActivity;
import com.taikor.investment.utils.TimeUtils;

/**
 * 看多、看空大ｖ投资观点
 * Created by Any on 2017/8/16.
 */

public class MoreAdviceAdapter extends ListBaseAdapter<MarketAdvice> {

    private Context context;

    public MoreAdviceAdapter(Context context) {
        super(context);
        this.context = context;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_more_advice;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {

        TextView title = holder.getView(R.id.more_title);
        title.setText(mDataList.get(position).getTitle());

        TextView name = holder.getView(R.id.more_name);
        String personName = mDataList.get(position).getPersonName();
        if(TextUtils.isEmpty(personName)){
            name.setVisibility(View.GONE);
        }else{
            name.setText(personName);
        }

        TextView date = holder.getView(R.id.more_date);
        date.setText(TimeUtils.longToString(mDataList.get(position).getL_PubDate()));

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, MarketDescActivity.class);
                intent.putExtra("itemId", mDataList.get(position).getPointId());
                intent.putExtra("type", 2);
                mContext.startActivity(intent);
            }
        });
    }
}
