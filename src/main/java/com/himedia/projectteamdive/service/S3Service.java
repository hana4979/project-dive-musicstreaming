package com.himedia.projectteamdive.service;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@Service
public class S3Service {

    private final String accessKeyId;
    private final String secretAccessKey;
    private final String region;
    private final String bucket;
    private final AmazonS3 s3Client;

    public S3Service(@Value("${aws.accessKeyId}") String accessKeyId,
                     @Value("${aws.secretAccessKey}") String secretAccessKey,
                     @Value("${aws.region}") String region,
                     @Value("${aws.s3.bucketName}") String bucket) {
        this.accessKeyId = accessKeyId;
        this.secretAccessKey = secretAccessKey;
        this.region = region;
        this.bucket = bucket;

        AWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();
    }

    public String saveFile(MultipartFile multipartFile,String s) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();
        String filePath= s+"/"+ UUID.randomUUID()+ originalFilename;

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        metadata.setContentType(multipartFile.getContentType());

        s3Client.putObject(bucket, filePath, multipartFile.getInputStream(), metadata);
        // 업로드된 파일의 경로와 이름 리턴
        return "https://d9k8tjx0yo0q5.cloudfront.net/"+filePath;
    }
    public void deleteFile(String filePath) {
        s3Client.deleteObject(bucket, filePath);
    }
    public File downloadFile(String s3FilePath) {
        String downloadPath = System.getProperty("user.home") + File.separator + "Downloads";
        File localFile = new File(downloadPath, new File(s3FilePath).getName());

        S3Object s3Object = null;
        try {
            s3Object = s3Client.getObject(new GetObjectRequest(bucket, s3FilePath));
            // InputStream으로 다운로드
            try (InputStream inputStream = s3Object.getObjectContent()) {
                // FileUtils로 로컬에 파일 복사
                FileUtils.copyInputStreamToFile(inputStream, localFile);
            }
        } catch (IOException e) {
            // 에러 로그 출력
            System.err.println("파일 다운로드 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
            return null; // 다운로드 실패시 null 반환
        }

        return localFile;
    }

}

