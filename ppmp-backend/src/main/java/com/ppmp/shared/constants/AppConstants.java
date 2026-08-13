package com.ppmp.shared.constants;

public final class AppConstants {

    private AppConstants() {}

    public static final String API_V1 = "/api/v1";

    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "20";
    public static final String DEFAULT_SORT_BY = "createdAt";
    public static final String DEFAULT_SORT_DIRECTION = "desc";

    public static final int MAX_PAGE_SIZE = 100;
    public static final int MAX_LOGIN_ATTEMPTS = 5;
    public static final int LOCK_DURATION_MINUTES = 15;

    public static final long MAX_FILE_SIZE = 10L * 1024 * 1024;

    public static final String ROLE_USER = "USER";
    public static final String ROLE_TEAM_LEAD = "TEAM_LEAD";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_SUPER_ADMIN = "SUPER_ADMIN";
}
