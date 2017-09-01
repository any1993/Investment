package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.General;
import com.taikor.investment.bean.MarketAdviceDesc;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.find.MarketDescActivity;
import com.taikor.investment.news.NewsDescActivity;

import java.util.List;

/**
 * 早推送
 * Created by Any on 2017/8/10.
 */

public class MorningAdapter extends ListBaseAdapter<General> {

    public MorningAdapter(Context context) {
        super(context);
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_morning;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        ImageView view = holder.getView(R.id.iv_morning_number);
        if (position == 0) {
            view.setImageResource(R.drawable.no1);
        } else if (position == 1) {
            view.setImageResource(R.drawable.no2);
        } else if (position == 2) {
            view.setImageResource(R.drawable.no3);
        }

        TextView title = holder.getView(R.id.tv_morning_title);
        title.setText(mDataList.get(position).getTitle());

        //早推送详情
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, NewsDescActivity.class);
                intent.putExtra("itemId", String.valueOf(mDataList.get(position).getId()));
                intent.putExtra("newsType",mDataList.get(position).getType());
                mContext.startActivity(intent);
            }
        });
    }
}
