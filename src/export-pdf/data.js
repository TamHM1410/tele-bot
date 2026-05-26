export const report=[
    {
        "id": 482,
        "evenType": "A08",
        "createdAt": "2026-04-17T07:46:14.000+00:00",
        "errorType": "INTERNAL_SYSTEM_ERROR",
        "errMsg": "[UNEXPECTED] org.springframework.dao.InvalidDataAccessResourceUsageException: could not execute statement [Unknown column 'data' in 'field list'] [insert into hl7_msg_log_model (admission_date,assigned_location,data,demographic,description,doctor_name,event_time_message,event_type,external_id,msg_id,patient_class,pre_uuid,provider_spell_id,reason_change,recorded_date,status,user_id,uuid) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; SQL [insert into hl7_msg_log_model (admission_date,assigned_location,data,demographic,description,doctor_name,event_time_message,event_type,external_id,msg_id,patient_class,pre_uuid,provider_spell_id,reason_change,recorded_date,status,user_id,uuid) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]",
        "hospitalId": "20096734",
        "msgId": "178515903",
        "rawMsg": "MSH|^~\\&|PAS|PHU|THINKVITALS|THINKVITALS|20260417084612||ADT^A08|178515903|P|2.2\rEVN|A08|||T||202604170014\rPID|||20096734^^^PAS^PI~6345405671^^^NHS^NHS||ALDERSON^CHRISTOPHER ROBERT^^^MR||19670920|M|||20 Cockleshell Squar^GOSPORT^Hampshire^^PO12 1FB||07704124245^PRN|^WPN||||||||||||||||N\rNK1|1|SARAH ALDERSON|WIFE|20 Cockleshell Squar^Gosport^Hampshire^^PO12 1FB|07729254401\rPV1||I|C6^^^QAH||||HB3^BOLAM (PHU)^H^^^Dr||||||||||||258607266|||||||||||||||||||||||||202604170014\r"
    },
    {
        "id": 481,
        "evenType": "A08",
        "createdAt": "2026-04-17T07:42:47.000+00:00",
        "errorType": "INTERNAL_SYSTEM_ERROR",
        "errMsg": "[UNEXPECTED] com.hl7.hl7ErrMsg.exception.ValidationError: EPISODE_NUMBER_NOT_MATCHED",
        "hospitalId": "IW071124",
        "msgId": "178515617",
        "rawMsg": "MSH|^~\\&|PAS|PHU|THINKVITALS|THINKVITALS|20260417084243||ADT^A08|178515617|P|2.2\rEVN|A08|20260417084243||D\rPID|||IW071124^^^PAS^PI~4589030012^^^NHS^NHS||ENTWISTLE^ELIZABETH^^^MRS||19550311|F|||90 new road^brading^sandown^isle of wight^PO36 0AB||862575^PRN|862575^WPN||||||||||||||||N\rPV1||I|EYEI^^^SMHI||||KHN   ^KHAN (IOW)^J||||||||||||255857880|||||||||||||||||||||||||20260225114500|202602251148\r"
    },
    {
        "id": 480,
        "evenType": "A08",
        "createdAt": "2026-04-17T07:41:54.000+00:00",
        "errorType": "INTERNAL_SYSTEM_ERROR",
        "errMsg": "[UNEXPECTED] com.hl7.hl7ErrMsg.exception.ValidationError: EPISODE_NUMBER_NOT_MATCHED",
        "hospitalId": "IW011002",
        "msgId": "178515552",
        "rawMsg": "MSH|^~\\&|PAS|PHU|THINKVITALS|THINKVITALS|20260417084153||ADT^A08|178515552|P|2.2\rEVN|A08|20260417084153||D\rPID|||IW011002^^^PAS^PI~4208019212^^^NHS^NHS||MACK^ANNE^^^MRS||19420102|F|||Kiln Place^Colwell Lane^Freshwater^Isle of Wight^PO40 9LX||01983754217^PRN|07904472787^WPN||||||||||||||||N\rPV1||I|EYEI^^^SMHI||||KHN   ^KHAN (IOW)^J||||||||||||257169052|||||||||||||||||||||||||20260225102400|202602251132\r"
    },
    {
        "id": 479,
        "evenType": "A08",
        "createdAt": "2026-04-17T07:39:19.000+00:00",
        "errorType": "INTERNAL_SYSTEM_ERROR",
        "errMsg": "[UNEXPECTED] com.hl7.hl7ErrMsg.exception.ValidationError: PATIENT_NOT_HAS_ANY_ACTIVE_EPISODE",
        "hospitalId": "07107028",
        "msgId": "178515377",
        "rawMsg": "MSH|^~\\&|PAS|PHU|THINKVITALS|THINKVITALS|20260417083916||ADT^A08|178515377|P|2.2\rEVN|A08|||T||202601311415\rPID|||07107028^^^PAS^PI~4724909919^^^NHS^NHS||TRAFFORD^MARK^^^MR||19701007|M|||17 PETTYCOT CRESCENT^GOSPORT^HAMPSHIRE^^PO13 0SJ||07891138508^PRN|01329516069^WPN||||||||||||||||N\rNK1|1|AMANDA|SISTER||07889575275\rPV1||I|DSUQ^^^QAH||||DJH^HODGSON (PHU)^DJ^^^MR||||||||||||255669145|||||||||||||||||||||||||202601311415\r"
    },
    {
        "id": 478,
        "evenType": "A02",
        "createdAt": "2026-04-17T07:37:25.000+00:00",
        "errorType": "INTERNAL_SYSTEM_ERROR",
        "errMsg": "[UNEXPECTED] could not execute statement [Unknown column 'data' in 'field list'] [insert into hl7_msg_log_model (admission_date,assigned_location,data,demographic,description,doctor_name,event_time_message,event_type,external_id,msg_id,patient_class,pre_uuid,provider_spell_id,reason_change,recorded_date,status,user_id,uuid) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; SQL [insert into hl7_msg_log_model (admission_date,assigned_location,data,demographic,description,doctor_name,event_time_message,event_type,external_id,msg_id,patient_class,pre_uuid,provider_spell_id,reason_change,recorded_date,status,user_id,uuid) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]",
        "hospitalId": "19015329",
        "msgId": "178515238",
        "rawMsg": "MSH|^~\\&|PAS|PHU|THINKVITALS|THINKVITALS|20260417083723||ADT^A02|178515238|P|2.2\rEVN|A02|202604170815\rPID|||19015329^^^PAS^PI~4604632634^^^NHS^NHS||BARKER^ANTHONY HOWARD^^^MR||19530119|M|||FLAT 2 PRIORY COURT^NEELANDS GROVE^PORTSMOUTH^HANTS^PO6 4RT||07796581704^PRN|07796581704^WPN||||||||||||||||N\rPV1||I|C7^^^QAH||||PRK^KALRA (PHU)^PR^^^DR||||||||||||258646421|||||||||||||||||||||||||202604170815\r"
    },
    {
        "id": 477,
        "evenType": "A13",
        "createdAt": "2026-04-17T07:36:59.000+00:00",
        "errorType": "INTERNAL_SYSTEM_ERROR",
        "errMsg": "[UNEXPECTED] could not execute statement [Unknown column 'data' in 'field list'] [insert into hl7_msg_log_model (admission_date,assigned_location,data,demographic,description,doctor_name,event_time_message,event_type,external_id,msg_id,patient_class,pre_uuid,provider_spell_id,reason_change,recorded_date,status,user_id,uuid) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]; SQL [insert into hl7_msg_log_model (admission_date,assigned_location,data,demographic,description,doctor_name,event_time_message,event_type,external_id,msg_id,patient_class,pre_uuid,provider_spell_id,reason_change,recorded_date,status,user_id,uuid) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)]",
        "hospitalId": "12104909",
        "msgId": "178515193",
        "rawMsg": "MSH|^~\\&|PAS|PHU|THINKVITALS|THINKVITALS|20260417083657||ADT^A13|178515193|P|2.2\rEVN|A13|20260417083657\rPID|||12104909^^^PAS^PI~4467859241^^^NHS^NHS||BOLT^SUSAN JANE^^^MRS||19491012|F|||75 GREENFIELD CRESCE^COWPLAIN^WATERLOOVILLE^HANTS^PO8 9EL||07905495663^PRN|02392 599699^WPN||||||||||||||||N\rPV1||I|HODU^^^QAH||||DBL   ^BLOOMFIELD (PHU)^DB||||||||||||258739366|||||||||||||||||||||||||20260416122400|202604161508\r"
    }
]