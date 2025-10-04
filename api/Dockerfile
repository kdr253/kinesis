FROM public.ecr.aws/lambda/python:3.11

# install pip packages
COPY requirements.txt  .
RUN  pip install -r requirements.txt

# copy app
COPY app ${LAMBDA_TASK_ROOT}/app

# set working dir
WORKDIR ${LAMBDA_TASK_ROOT}

# lambda entrypoint
CMD ["app.main.handler"]
