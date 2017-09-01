package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.General;
import com.taikor.investment.find.GeneralDescActivity;
import com.taikor.investment.utils.Constant;

/**
 * 专题
 * Created by Any on 2017/8/10.
 */

public class TopicAdapter extends ListBaseAdapter<General> {

    private Context mContext;

    public TopicAdapter(Context context) {
        super(context);
        mContext = context;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_topic;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        //标题
        TextView title = holder.getView(R.id.tv_topic_title);
        title.setText(mDataList.get(position).getTitle());

        //时间
        TextView time = holder.getView(R.id.tv_topic_date);
        String pubDate = mDataList.get(position).getPubDate();
        String substring = pubDate.substring(5,16);
        time.setText(substring);

        //图片
        ImageView image = holder.getView(R.id.iv_topic_image);
        Glide.with(mContext)
                .load(Constant.URL_HEAD2 + mDataList.get(position).getImageUrl())
                .placeholder(R.drawable.default_image)
                .error(R.drawable.default_image)
                .into(image);
        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, GeneralDescActivity.class);
                intent.putExtra("itemId",mDataList.get(position).getId());
                intent.putExtra("fromPage","topic");
                mContext.startActivity(intent);
            }
        });
    }
}
