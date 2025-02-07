package com.confy.auth_user_group_service.meetingResult.enums;

public enum MeetingResultType {
    ALL("all"),
    FAVORITE("favorite"),
    GROUP("group");

    private final String value;

    MeetingResultType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value;
    }
}
