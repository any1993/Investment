package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.text.TextUtils;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.General;
import com.taikor.investment.news.NewsDescActivity;
import com.taikor.investment.utils.Constant;
import com.taikor.investment.utils.TimeUtils;

/**
 * 通用资讯
 * Created by Any on 2017/7/27.
 */

public class GeneralAdapter extends ListBaseAdapter<General> {

    private Context mContext;

    public GeneralAdapter(Context context) {
        super(context);
        mContext=context;
    }

    @Override
    public int getLayoutId() {
        return R.layout.item_general;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        //标题
        TextView title = holder.getView(R.id.tv_general_title);
        title.setText(mDataList.get(position).getTitle());
        //日期
        TextView time = holder.getView(R.id.tv_general_date);
        time.setText(TimeUtils.getData(mDataList.get(position).getPubDate()));
        //标签
        TextView tag1 = holder.getView(R.id.tv_general_tag1);
        TextView tag2 = holder.getView(R.id.tv_general_tag2);
        String tag = mDataList.get(position).getTag();
        if (!TextUtils.isEmpty(tag)) {
            String[] split = tag.split(",");
            if (split.length == 1) {
                String[] split1 = split[0].split(":");
                tag1.setText(split1[0]);
                tag1.setVisibility(View.VISIBLE);
                tag2.setVisibility(View.GONE);
            } else if (split.length == 2) {
                String[] split1 = split[0].split(":");
                String[] split2 = split[1].split(":");
                tag1.setText(split1[0]);
                tag2.setText(split2[0]);

                tag1.setVisibility(View.VISIBLE);
                tag2.setVisibility(View.VISIBLE);
            }
        } else {
            tag1.setVisibility(View.GONE);
            tag2.setVisibility(View.GONE);
        }
        //图片
        ImageView image = holder.getView(R.id.iv_general_image);
        Glide.with(mContext)
                .load(Constant.URL_HEAD + mDataList.get(position).getImageUrl())
                .placeholder(R.drawable.default_image)
                .error(R.drawable.default_image)
                .into(image);

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, NewsDescActivity.class);
                intent.putExtra("itemId",mDataList.get(position).getId());
                intent.putExtra("type", mDataList.get(position).getType());
                mContext.startActivity(intent);
            }
        });
    }
}
