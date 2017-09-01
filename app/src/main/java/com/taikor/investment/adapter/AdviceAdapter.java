package com.taikor.investment.adapter;

import android.content.Context;
import android.content.Intent;
import android.support.v4.content.ContextCompat;
import android.support.v4.view.animation.FastOutLinearInInterpolator;
import android.text.TextUtils;
import android.view.TextureView;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;
import com.taikor.investment.R;
import com.taikor.investment.base.ListBaseAdapter;
import com.taikor.investment.base.SuperViewHolder;
import com.taikor.investment.bean.MainAdvice;
import com.taikor.investment.find.MarketDescActivity;
import com.taikor.investment.utils.CommonUtils;

import java.util.List;

/**
 * 大V投资观点
 * Created by Any on 2017/7/28.
 */

public class AdviceAdapter extends ListBaseAdapter<MainAdvice> {
    
    public AdviceAdapter(Context context){
        super(context);
    }
    
    @Override
    public int getLayoutId() {
        return R.layout.item_advice;
    }

    @Override
    public void onBindItemHolder(SuperViewHolder holder, final int position) {
        ImageView photo = holder.getView(R.id.tv_advice_photo);
        TextView person = holder.getView(R.id.tv_advice_name);
        TextView type = holder.getView(R.id.tv_advice_type);
        TextView fans = holder.getView(R.id.tv_advice_fans);
        TextView accuracy = holder.getView(R.id.tv_advice_accuracy);
        TextView title = holder.getView(R.id.tv_advice_title);
        TextView item = holder.getView(R.id.tv_advice_item);
        TextView trade = holder.getView(R.id.tv_advice_trade);
        TextView change = holder.getView(R.id.tv_advice_change);
        ImageView flag = holder.getView(R.id.iv_advice_flag);


        if(position==0){
            Glide.with(mContext).load(mDataList.get(0).getBlockView().getHeadImg()).into(photo);
            person.setText(mDataList.get(0).getBlockView().getAuthorName());
            int adviceType = mDataList.get(0).getBlockView().getType();
            if(adviceType==0){
                type.setText("看涨");
                type.setBackgroundResource(R.color.up);
            }else if(adviceType==1){
                type.setText("看平");
                type.setBackgroundResource(R.color.text_color_3);
            }else if(adviceType==2){
                type.setText("看空");
                type.setBackgroundResource(R.color.down);
            }
            Object fanCount = mDataList.get(0).getBlockView().getFanCount();
            if(fanCount==null){
                fans.setText("");
            }else{
                fans.setText("粉丝数"+fanCount);
            }
            Object accuray = mDataList.get(0).getBlockView().getAccuray();
            if(accuray==null){
                accuracy.setText("");
            }else {
                accuracy.setText("准确率"+accuray);
            }
            title.setText(mDataList.get(0).getBlockView().getTitle());
            //item
            double itemChange = mDataList.get(0).getBlockView().getItemChange();
            if(itemChange>0){
                change.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                trade.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                item.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                change.setText(CommonUtils.setDoubleTwo(itemChange) + "%");
                flag.setImageResource(R.drawable.advice_up);
            }else if(itemChange<0){
                change.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                trade.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                item.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                change.setText(CommonUtils.setDoubleTwo(itemChange) + "%");
                flag.setImageResource(R.drawable.sell);
            }else{
                change.setText("0.00%");
            }
            trade.setText(CommonUtils.setDoubleTwo(mDataList.get(0).getBlockView().getItemTrade()));
            item.setText(mDataList.get(0).getBlockView().getItemName());

        }else if(position==1){
            Glide.with(mContext).load(mDataList.get(0).getTopicView().getHeadImg()).into(photo);
            person.setText(mDataList.get(0).getTopicView().getAuthorName());
            int adviceType = mDataList.get(0).getTopicView().getType();
            if(adviceType==0){
                type.setText("看涨");
                type.setBackgroundResource(R.color.up);
            }else if(adviceType==1){
                type.setText("看平");
                type.setBackgroundResource(R.color.text_color_3);
            }else if(adviceType==2){
                type.setText("看空");
                type.setBackgroundResource(R.color.down);
            }
            Object fanCount = mDataList.get(0).getTopicView().getFanCount();
            if(fanCount==null){
                fans.setText("");
            }else{
                fans.setText("粉丝数"+fanCount);
            }
            Object accuray = mDataList.get(0).getTopicView().getAccuray();
            if(accuray==null){
                accuracy.setText("");
            }else {
                accuracy.setText("准确率"+accuray);
            }
            title.setText(mDataList.get(0).getTopicView().getTitle());
            //item
            double itemChange = mDataList.get(0).getTopicView().getItemChange();
            if(itemChange>0){
                change.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                trade.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                item.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                change.setText(CommonUtils.setDoubleTwo(itemChange) + "%");
                flag.setImageResource(R.drawable.advice_up);
            }else if(itemChange<0){
                change.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                trade.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                item.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                change.setText(CommonUtils.setDoubleTwo(itemChange) + "%");
                flag.setImageResource(R.drawable.sell);
            }else{
                change.setText("0.00%");
            }
            trade.setText(CommonUtils.setDoubleTwo(mDataList.get(0).getTopicView().getItemTrade()));
            item.setText(mDataList.get(0).getTopicView().getItemName());
        }else if(position==2){
            Glide.with(mContext).load(mDataList.get(0).getStockView().getHeadImg()).into(photo);
            person.setText(mDataList.get(0).getStockView().getAuthorName());
            int adviceType = mDataList.get(0).getStockView().getType();
            if(adviceType==0){
                type.setText("看涨");
                type.setBackgroundResource(R.color.up);
            }else if(adviceType==1){
                type.setText("看平");
                type.setBackgroundResource(R.color.text_color_3);
            }else if(adviceType==2){
                type.setText("看空");
                type.setBackgroundResource(R.color.down);
            }
            Object fanCount = mDataList.get(0).getStockView().getFanCount();
            if(fanCount==null){
                fans.setText("");
            }else{
                fans.setText("粉丝数"+fanCount);
            }
            Object accuray = mDataList.get(0).getStockView().getAccuray();
            if(accuray==null){
                accuracy.setText("");
            }else {
                accuracy.setText("准确率"+accuray);
            }
            title.setText(mDataList.get(0).getStockView().getTitle());
            //item
            double itemChange = mDataList.get(0).getStockView().getItemChange();
            if(itemChange>0){
                change.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                trade.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                item.setTextColor(ContextCompat.getColor(mContext, R.color.up));
                change.setText(CommonUtils.setDoubleTwo(itemChange) + "%");
                flag.setImageResource(R.drawable.advice_up);
            }else if(itemChange<0){
                change.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                trade.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                item.setTextColor(ContextCompat.getColor(mContext, R.color.down));
                change.setText(CommonUtils.setDoubleTwo(itemChange) + "%");
                flag.setImageResource(R.drawable.sell);
            }else{
                change.setText("0.00%");
            }
            trade.setText(CommonUtils.setDoubleTwo(mDataList.get(0).getStockView().getItemTrade()));
            item.setText(mDataList.get(0).getStockView().getItemName());
        }

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(mContext, MarketDescActivity.class);
                if (position == 0) {
                    intent.putExtra("itemId", mDataList.get(position).getBlockView().getViewID());
                    intent.putExtra("type", 2);
                } else if (position == 1) {
                    intent.putExtra("itemId", mDataList.get(position).getTopicView().getViewID());
                    intent.putExtra("type", 0);
                } else if (position == 2) {
                    intent.putExtra("itemId", mDataList.get(position).getStockView().getViewID());
                    intent.putExtra("type", 0);
                }
                mContext.startActivity(intent);
            }
        });
    }
}
