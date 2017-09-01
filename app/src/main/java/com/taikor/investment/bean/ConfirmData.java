package com.taikor.investment.bean;

import java.io.Serializable;

/**
 * 加密认证
 * Created by Any on 2017/8/8.
 */

public class ConfirmData implements Serializable {


    /**
     * AccessToken : eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5LnBhbGFzcG9tLmNvbS9pZCIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkucGFsYXNwb20uY29tL2lkL3Jlc291cmNlcyIsImV4cCI6MTUwMjE4MTk1MCwibmJmIjoxNTAyMTc0NzQ0LCJjbGllbnRfaWQiOiJvcGVuYXBpIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInJvbGVzIiwiYXBpX3JlYWQiLCJvZmZsaW5lX2FjY2VzcyJdLCJzdWIiOiIxMSIsImF1dGhfdGltZSI6IjE1MDA5ODM2NzEiLCJpZHAiOiJpZHNydiIsInByZWZlcnJlZF91c2VybmFtZSI6InNhbmVyLndhbmdAdGFpa29yLmNvbSIsImVtYWlsIjoic2FuZXIud2FuZ0B0YWlrb3IuY29tIiwiZW1haWxfdmVyaWZpZWQiOiJmYWxzZSIsInJvbGUiOiJyZWFkZXIiLCJhbXIiOlsicGFzc3dvcmQiXX0.I71aa_8ZN5FJUJ1IVFC3GGfRBORPwnYstNPsKRKNb0Aydo4HTWoMesBCuy1UMunuXhuCOFuf9H9T7gih3_C_KmgpM_fc1YTJgwUBTS64knN35NXMvW4zzP8iQGoygzN54oFnLOCCGoQ7zdmsQmGnXti701anXV4-w9yOdAH3rsdjECu-D4HMm43hidXUkgqbzI9Vow3U1ig3tRpoCsRMGmMlBSjq9bCpockqe9tGVXeperB4O7xRDs0kwsvnHEUsBrICgm7Z-S2QXKNhKWSLjcY97StIpCmfxymGZXG2iJOwD2rkmwdHJDfNLF5sXv1HFcyIhxup0T2GOkniW_PXoQ
     * Error : null
     * ExpiresIn : 2296
     * HttpErrorReason : null
     * HttpErrorStatusCode : 0
     * IsError : false
     * IsHttpError : false
     * RefreshToken : bce72d6f7d4188e72e0be45b1e0b51ec
     * TokenType : Bearer
     */

    private String AccessToken;
    private Object Error;
    private int ExpiresIn;
    private Object HttpErrorReason;
    private int HttpErrorStatusCode;
    private boolean IsError;
    private boolean IsHttpError;
    private String RefreshToken;
    private String TokenType;

    public String getAccessToken() {
        return AccessToken;
    }

    public void setAccessToken(String AccessToken) {
        this.AccessToken = AccessToken;
    }

    public Object getError() {
        return Error;
    }

    public void setError(Object Error) {
        this.Error = Error;
    }

    public int getExpiresIn() {
        return ExpiresIn;
    }

    public void setExpiresIn(int ExpiresIn) {
        this.ExpiresIn = ExpiresIn;
    }

    public Object getHttpErrorReason() {
        return HttpErrorReason;
    }

    public void setHttpErrorReason(Object HttpErrorReason) {
        this.HttpErrorReason = HttpErrorReason;
    }

    public int getHttpErrorStatusCode() {
        return HttpErrorStatusCode;
    }

    public void setHttpErrorStatusCode(int HttpErrorStatusCode) {
        this.HttpErrorStatusCode = HttpErrorStatusCode;
    }

    public boolean isIsError() {
        return IsError;
    }

    public void setIsError(boolean IsError) {
        this.IsError = IsError;
    }

    public boolean isIsHttpError() {
        return IsHttpError;
    }

    public void setIsHttpError(boolean IsHttpError) {
        this.IsHttpError = IsHttpError;
    }

    public String getRefreshToken() {
        return RefreshToken;
    }

    public void setRefreshToken(String RefreshToken) {
        this.RefreshToken = RefreshToken;
    }

    public String getTokenType() {
        return TokenType;
    }

    public void setTokenType(String TokenType) {
        this.TokenType = TokenType;
    }
}
