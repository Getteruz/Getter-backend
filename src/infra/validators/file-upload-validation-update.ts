import { ParseFilePipeBuilder } from '@nestjs/common';

const FileUploadValidationForUpdate = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: /(jpg|jpeg|png|gif|mp4|pdf|doc)$/,
  })
  .addMaxSizeValidator({
    maxSize: 5 * 1024 * 1024,
  })
  .build({
    fileIsRequired: false,
  });

export default FileUploadValidationForUpdate;
