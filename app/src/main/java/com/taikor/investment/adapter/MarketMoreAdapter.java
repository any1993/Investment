package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.MarketAdvice;
import com.taikor.investment.find.MarketActivity;
import com.taikor.investment.find.MarketDescActivity;

import de.hdodenhof.circleimageview.CircleImageView;

/**
 * 看多、看空大ｖ投资观点
 * Created by Any on 2017/8/16.
 */

public class MarketMoreAdapter extends ListBaseAdapter<MarketAdvice> {

    private Context context;

    public MarketMoreAdapter(Context context){
        super(context);
        this.context=context;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_market_more;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        CircleImageView photo = holder.getView(R.id.iv_more_photo);
        Glide.with(context).load(mDataList.get(position).getImageUrl()).into(photo);

        TextView name = holder.getView(R.id.tv_more_name);
        name.setText(mDataList.get(position).getPersonName());
        TextView date = holder.getView(R.id.tv_more_date);
        //2017-05-23T09:37:40+08:00"
        String pubDate = mDataList.get(position).getPubDate();
        String substring = pubDate.substring(5, 16);
        String t = substring.replace("T", " ");
        date.setText(t);
        TextView title = holder.getView(R.id.tv_more_title);
        title.setText(mDataList.get(position).getTitle());

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, MarketDescActivity.class);
                intent.putExtra("itemId",mDataList.get(position).getPointId());
                intent.putExtra("type", 2);
                mContext.startActivity(intent);
            }
        });
    }
}
